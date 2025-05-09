// src/app/api/cater-valley/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { calculateDeliveryFee } from '@/services/caterValleyService';

// Define schema for validating incoming order data
const orderSchema = z.object({
  orderCode: z.string(),
  deliveryDate: z.string(),
  deliveryTime: z.string(),
  totalItem: z.number(),
  priceTotal: z.number(),
  pickupLocation: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string()
  }),
  dropOffLocation: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    instructions: z.string().optional(),
    recipient: z.object({
      name: z.string(),
      phone: z.string()
    })
  }),
  id: z.string().optional() // For updates to existing orders
});

export async function POST(request: NextRequest) {
  try {
    // Validate the partner header for security
    const partnerHeader = request.headers.get('partner');
    if (partnerHeader !== 'cater-valley') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const parsedData = orderSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.format() },
        { status: 400 }
      );
    }
    
    const orderData = parsedData.data;
    
    // Check if this is an update to an existing order
    if (orderData.id) {
      // Update existing order
      const updatedOrder = await updateExistingOrder(orderData);
      return NextResponse.json({
        id: updatedOrder.id,
        deliveryFee: updatedOrder.deliveryFee
      });
    } else {
      // Create new order
      const newOrder = await createNewOrder(orderData);
      return NextResponse.json({
        id: newOrder.id,
        deliveryFee: newOrder.deliveryFee
      });
    }
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

async function createNewOrder(orderData: any) {
  const deliveryFee = await calculateDeliveryFee(orderData);
  
  try {
    // Create pickup address
    const pickupAddress = await prisma.address.create({
      data: {
        name: orderData.pickupLocation.name,
        street1: orderData.pickupLocation.address,
        city: orderData.pickupLocation.city,
        state: orderData.pickupLocation.state,
        zip: '00000', // Default since not provided
        isRestaurant: true
      }
    });
    
    // Create delivery address
    const deliveryAddress = await prisma.address.create({
      data: {
        name: orderData.dropOffLocation.name,
        street1: orderData.dropOffLocation.address,
        city: orderData.dropOffLocation.city,
        state: orderData.dropOffLocation.state,
        zip: '00000', // Default since not provided
      }
    });
    
    // Find system admin user
    const adminUser = await prisma.profile.findFirst({
      where: {
        type: 'ADMIN'
      }
    });
    
    if (!adminUser) {
      throw new Error('No admin user found for order creation');
    }

    // Get headcount estimate
    const headcount = Math.ceil(orderData.totalItem / 1.5);
    
    // Create the catering request
    const cateringRequest = await prisma.cateringRequest.create({
      data: {
        userId: adminUser.id,
        pickupAddressId: pickupAddress.id,
        deliveryAddressId: deliveryAddress.id,
        orderNumber: orderData.orderCode,
        headcount,
        pickupDateTime: new Date(`${orderData.deliveryDate}T${orderData.deliveryTime}`),
        arrivalDateTime: new Date(`${orderData.deliveryDate}T${orderData.deliveryTime}`),
        orderTotal: orderData.priceTotal,
        status: 'ACTIVE',
        specialNotes: orderData.dropOffLocation.instructions || '',
        // Add any additional metadata as needed
      }
    });
    
    return {
      id: cateringRequest.id,
      deliveryFee
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

async function updateExistingOrder(orderData: any) {
  const deliveryFee = await calculateDeliveryFee(orderData);
  
  try {
    // Find the existing catering request
    const existingRequest = await prisma.cateringRequest.findFirst({
      where: {
        id: orderData.id
      },
      include: {
        pickupAddress: true,
        deliveryAddress: true
      }
    });
    
    if (!existingRequest) {
      throw new Error(`Order with ID ${orderData.id} not found`);
    }
    
    // Update pickup address
    await prisma.address.update({
      where: { id: existingRequest.pickupAddressId },
      data: {
        name: orderData.pickupLocation.name,
        street1: orderData.pickupLocation.address,
        city: orderData.pickupLocation.city,
        state: orderData.pickupLocation.state,
      }
    });
    
    // Update delivery address
    await prisma.address.update({
      where: { id: existingRequest.deliveryAddressId },
      data: {
        name: orderData.dropOffLocation.name,
        street1: orderData.dropOffLocation.address,
        city: orderData.dropOffLocation.city,
        state: orderData.dropOffLocation.state,
      }
    });
    
    // Get headcount estimate
    const headcount = Math.ceil(orderData.totalItem / 1.5);
    
    // Update the catering request
    const updatedRequest = await prisma.cateringRequest.update({
      where: { id: orderData.id },
      data: {
        orderNumber: orderData.orderCode,
        headcount,
        pickupDateTime: new Date(`${orderData.deliveryDate}T${orderData.deliveryTime}`),
        arrivalDateTime: new Date(`${orderData.deliveryDate}T${orderData.deliveryTime}`),
        orderTotal: orderData.priceTotal,
        specialNotes: orderData.dropOffLocation.instructions || '',
        // Add any additional metadata as needed
      }
    });
    
    return {
      id: updatedRequest.id,
      deliveryFee
    };
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

// PUT endpoint to finalize an order
export async function PUT(request: NextRequest) {
  try {
    const partnerHeader = request.headers.get('partner');
    if (partnerHeader !== 'cater-valley') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, isAccepted } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Update order status to CONFIRMED or CANCELLED
    const order = await prisma.cateringRequest.update({
      where: {
        id: id
      },
      data: {
        status: isAccepted ? 'ACTIVE' : 'CANCELLED'
      }
    });
    
    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status
    });
  } catch (error) {
    console.error('Error finalizing order:', error);
    return NextResponse.json(
      { error: 'Failed to finalize order' },
      { status: 500 }
    );
  }
}
