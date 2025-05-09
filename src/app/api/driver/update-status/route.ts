// src/app/api/driver/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB';
import { 
  updateCaterValleyOrderStatus, 
  mapDriverStatusToCaterValley 
} from '@/services/caterValleyService';
import { getAuthenticatedUser } from '@/utils/api-auth';
import { DriverStatus, UserType } from '@prisma/client';

// Valid status transitions
const validStatusTransitions: Record<string, string[]> = {
  'ASSIGNED': ['ARRIVED_AT_VENDOR'],
  'ARRIVED_AT_VENDOR': ['EN_ROUTE_TO_CLIENT'],
  'EN_ROUTE_TO_CLIENT': ['ARRIVED_TO_CLIENT'],
  'ARRIVED_TO_CLIENT': ['COMPLETED']
};

type OrderType = 'catering' | 'ondemand';

export async function POST(request: NextRequest) {
  try {
    // Check authentication using Supabase
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    // Get the user profile to check role
    const userProfile = await prisma.profile.findUnique({
      where: { id: authResult.user.id },
      select: { type: true }
    });

    // Check if user is a driver or admin
    if (!userProfile || (
        userProfile.type !== UserType.DRIVER && 
        userProfile.type !== UserType.ADMIN &&
        userProfile.type !== UserType.SUPER_ADMIN
    )) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { orderId, status, orderType = 'catering' } = body as {
      orderId: string;
      status: string;
      orderType?: OrderType;
    };
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }
    
    // Get current order based on order type
    let order;
    let updatedOrder;
    
    if (orderType === 'catering') {
      order = await prisma.cateringRequest.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        return NextResponse.json(
          { error: 'Catering order not found' },
          { status: 404 }
        );
      }
      
      // Validate status transition
      const currentStatus = order.driverStatus || 'ASSIGNED';
      if (
        validStatusTransitions[currentStatus] && 
        !validStatusTransitions[currentStatus].includes(status)
      ) {
        return NextResponse.json(
          { error: `Invalid status transition from ${currentStatus} to ${status}` },
          { status: 400 }
        );
      }
      
      // Update our internal order status
      updatedOrder = await prisma.cateringRequest.update({
        where: { id: orderId },
        data: { 
          driverStatus: status as DriverStatus,
          updatedAt: new Date()
        }
      });
      
      // Only notify CaterValley if the order has an order number
      if (order.orderNumber) {
        try {
          // Map our status to CaterValley status
          const caterValleyStatus = mapDriverStatusToCaterValley(status);
          
          // Call the webhook to update CaterValley
          const webhookResult = await updateCaterValleyOrderStatus(
            order.orderNumber,
            caterValleyStatus
          );
          
          if (!webhookResult.result) {
            console.error('Failed to update CaterValley status:', webhookResult.message);
            // We don't fail the request here, just log the error
          }
        } catch (webhookError) {
          console.error('Error updating CaterValley status:', webhookError);
          // We don't fail the request here, just log the error
        }
      }
    } else {
      // Handle on-demand orders
      order = await prisma.onDemand.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        return NextResponse.json(
          { error: 'On-demand order not found' },
          { status: 404 }
        );
      }
      
      // Validate status transition
      const currentStatus = order.driverStatus || 'ASSIGNED';
      if (
        validStatusTransitions[currentStatus] && 
        !validStatusTransitions[currentStatus].includes(status)
      ) {
        return NextResponse.json(
          { error: `Invalid status transition from ${currentStatus} to ${status}` },
          { status: 400 }
        );
      }
      
      // Update our internal order status
      updatedOrder = await prisma.onDemand.update({
        where: { id: orderId },
        data: { 
          driverStatus: status as DriverStatus,
          updatedAt: new Date()
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder!.id,
        status: updatedOrder!.driverStatus,
        orderNumber: 'orderNumber' in updatedOrder! ? updatedOrder!.orderNumber : null,
        orderType
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
