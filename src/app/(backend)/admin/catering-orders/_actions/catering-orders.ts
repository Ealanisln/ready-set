'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
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
      where: {
        type: 'CLIENT',
        name: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return clients as ClientListItem[];
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { error: "Database error: Failed to fetch clients." };
  }
}

/**
 * Creates a new CateringRequest order.
 */
export async function createCateringOrder(formData: CreateCateringOrderInput): Promise<CreateOrderResult> {
  console.log("=== SERVER ACTION: createCateringOrder called ===");
  console.log("Received data:", JSON.stringify(formData, null, 2));
  
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

  console.log("Validation passed successfully");
  const data = validationResult.data;

  // Generate a unique order number using UUID
  const orderNumber = data.orderNumber || `CATER-${uuidv4()}`;
  console.log(`Attempting to create order with orderNumber: ${orderNumber}`);

  try {
    // 2. Perform database operations within a transaction
    console.log("Starting database transaction");
    const newOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create pickup address
      console.log("Creating pickup address");
      const pickupAddress = await tx.address.create({
        data: data.pickupAddress,
      });
      console.log("Pickup address created:", pickupAddress.id);
      
      // Create delivery address
      console.log("Creating delivery address");
      const deliveryAddress = await tx.address.create({
        data: data.deliveryAddress,
      });
      console.log("Delivery address created:", deliveryAddress.id);

      // Create the CateringRequest
      console.log("Creating catering request record");
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
      console.log("Catering request created:", order.id);
      return order;
    });

    console.log("Transaction completed successfully");
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
    
    // Print the full error details
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Unknown error type:", error);
    }
    
    // Check if the error is a Prisma unique constraint violation on orderNumber
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // Assuming the unique constraint is on 'orderNumber'. Adjust field name if different.
      const targetFields = error.meta?.target as string[] | undefined;
      if (targetFields?.includes('orderNumber')) {
        return {
          success: false,
          error: `Order number '${orderNumber}' already exists. Please use a unique order number.`,
          fieldErrors: { 
            orderNumber: { _errors: [`Order number '${orderNumber}' already exists.`] },
            _errors: [] // Add top-level _errors array
           } 
        };
      }
    }

    // Generic database error
    return {
      success: false,
      error: "Database error: Failed to create catering order.",
    };
  }
}

// --- Create Order Action (will be added next) --- 