'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import {
  ClientListItem,
  ActionError,
  createCateringOrderSchema,
  CreateCateringOrderInput,
  CreateOrderResult
} from './schemas';

/**
 * Fetches a list of potential clients (Profiles).
 */
export async function getClients(): Promise<ClientListItem[] | ActionError> {
  try {
    const clients = await prisma.profile.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    // Filter out profiles with null names
    return clients.filter((client: { id: string; name: string | null }): client is ClientListItem => client.name !== null);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { error: "Database error: Failed to fetch clients." };
  }
}

/**
 * Creates a new CateringRequest order.
 */
export async function createCateringOrder(formData: CreateCateringOrderInput): Promise<CreateOrderResult> {
  // 1. Validate the input data
  const validationResult = createCateringOrderSchema.safeParse(formData);
  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.format());
    return {
      success: false,
      error: "Validation failed. Please check the form fields.",
      fieldErrors: validationResult.error.format(),
    };
  }

  const data = validationResult.data;

  // Generate a unique order number if one wasn't provided
  const orderNumber = data.orderNumber || `CATER-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    // 2. Perform database operations within a transaction
    const newOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const pickupAddress = await tx.address.create({
        data: data.pickupAddress,
      });
      const deliveryAddress = await tx.address.create({
        data: data.deliveryAddress,
      });

      // Create the CateringRequest
      const order = await tx.cateringRequest.create({
        data: {
          userId: data.userId,
          orderNumber: orderNumber,
          brokerage: data.brokerage,
          status: 'ACTIVE',
          pickupDateTime: data.pickupDateTime,
          arrivalDateTime: data.arrivalDateTime,
          completeDateTime: data.completeDateTime,
          headcount: data.headcount,
          needHost: data.needHost,
          hoursNeeded: data.hoursNeeded,
          numberOfHosts: data.numberOfHosts,
          clientAttention: data.clientAttention,
          pickupNotes: data.pickupNotes,
          specialNotes: data.specialNotes,
          orderTotal: data.orderTotal,
          tip: data.tip,
          pickupAddressId: pickupAddress.id,
          deliveryAddressId: deliveryAddress.id,
        },
      });
      return order;
    });

    // 3. Revalidate relevant paths
    revalidatePath('/admin/catering-orders');
    revalidatePath('/(api)/orders/catering-orders'); // Example: Revalidate an API route if needed

    // 4. Return success result
    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
    };

  } catch (error) {
    console.error("Failed to create catering order:", error);
    return {
      success: false,
      error: "Database error: Failed to create catering order.",
    };
  }
}

// --- Create Order Action (will be added next) --- 