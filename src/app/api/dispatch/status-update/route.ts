import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DispatchSystemError, trackDispatchError } from '@/utils/domain-error-tracking';

// Status update validation schema
const statusUpdateSchema = z.object({
  dispatchId: z.string().uuid(),
  driverId: z.string().uuid(),
  orderId: z.string().uuid(),
  status: z.enum([
    'ACCEPTED',
    'EN_ROUTE_TO_PICKUP',
    'ARRIVED_AT_PICKUP',
    'PICKUP_COMPLETE',
    'EN_ROUTE_TO_DELIVERY',
    'ARRIVED_AT_DELIVERY',
    'DELIVERY_COMPLETE',
    'CANCELED',
    'DELAYED',
    'FAILED'
  ]),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
  }).optional(),
  timestamp: z.string().datetime().default(() => new Date().toISOString()),
  notes: z.string().optional(),
  delay: z.object({
    reason: z.string(),
    estimatedDelayMinutes: z.number().int().min(1),
  }).optional(),
  deliveryPhoto: z.string().optional(),
});

type StatusUpdateRequest = z.infer<typeof statusUpdateSchema>;

/**
 * Mock function to validate driver permissions for dispatch
 */
async function validateDriverDispatchPermission(
  driverId: string,
  dispatchId: string
): Promise<boolean> {
  // Simulate permission check
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // For testing purposes, certain IDs will be rejected
  return !dispatchId.includes('unauthorized');
}

/**
 * Mock function to send notification about status update
 */
async function sendStatusNotification(
  status: string,
  dispatchId: string,
  orderId: string,
  recipientType: 'CUSTOMER' | 'ADMIN' | 'STORE'
): Promise<{ success: boolean; error?: string }> {
  // Simulate notification sending
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulate random notification failures for testing
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: `Failed to send notification to ${recipientType.toLowerCase()}`
    };
  }
  
  return { success: true };
}

/**
 * Mock function to update dispatch status in database
 */
async function updateDispatchStatus(
  dispatchId: string,
  update: StatusUpdateRequest
): Promise<{ success: boolean; error?: string }> {
  // Simulate database operation
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Simulate database errors (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: 'Database connection error while updating dispatch status'
    };
  }
  
  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const updateResult = statusUpdateSchema.safeParse(body);
    
    if (!updateResult.success) {
      // Extract validation errors from Zod
      const validationErrors = updateResult.error.format();
      
      // Create error with context for tracking
      const error = new DispatchSystemError(
        'Status update validation failed',
        'STATUS_UPDATE_FAILED',
        {
          dispatchId: body.dispatchId,
          driverId: body.driverId,
          orderId: body.orderId,
          deliveryStatus: body.status
        }
      );
      
      // Track the error with Highlight.io
      trackDispatchError(error, error.type, error.context);
      
      // Return appropriate error response
      return NextResponse.json({ 
        error: 'Status update validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    const updateData = updateResult.data;
    
    // Validate driver permissions
    try {
      const hasPermission = await validateDriverDispatchPermission(
        updateData.driverId,
        updateData.dispatchId
      );
      
      if (!hasPermission) {
        const error = new DispatchSystemError(
          'Driver not authorized for this dispatch',
          'STATUS_UPDATE_FAILED',
          {
            dispatchId: updateData.dispatchId,
            driverId: updateData.driverId,
            orderId: updateData.orderId,
            deliveryStatus: updateData.status
          }
        );
        
        trackDispatchError(error, error.type, error.context);
        
        return NextResponse.json({
          error: 'Driver not authorized to update this dispatch'
        }, { status: 403 });
      }
    } catch (error) {
      const permissionError = new DispatchSystemError(
        'Failed to validate driver permissions',
        'STATUS_UPDATE_FAILED',
        {
          dispatchId: updateData.dispatchId,
          driverId: updateData.driverId,
          orderId: updateData.orderId
        }
      );
      
      trackDispatchError(permissionError, permissionError.type, permissionError.context);
      
      return NextResponse.json({
        error: 'Failed to validate driver permissions'
      }, { status: 500 });
    }
    
    // Update status in database
    try {
      const updateResult = await updateDispatchStatus(
        updateData.dispatchId,
        updateData
      );
      
      if (!updateResult.success) {
        const error = new DispatchSystemError(
          updateResult.error || 'Failed to update dispatch status',
          'STATUS_UPDATE_FAILED',
          {
            dispatchId: updateData.dispatchId,
            driverId: updateData.driverId,
            orderId: updateData.orderId,
            deliveryStatus: updateData.status
          }
        );
        
        trackDispatchError(error, error.type, error.context);
        
        return NextResponse.json({
          error: updateResult.error || 'Failed to update dispatch status'
        }, { status: 500 });
      }
    } catch (error) {
      const updateError = new DispatchSystemError(
        error instanceof Error ? error.message : 'Unknown error updating status',
        'STATUS_UPDATE_FAILED',
        {
          dispatchId: updateData.dispatchId,
          driverId: updateData.driverId,
          orderId: updateData.orderId,
          deliveryStatus: updateData.status
        }
      );
      
      trackDispatchError(updateError, updateError.type, updateError.context);
      
      return NextResponse.json({
        error: 'Failed to update dispatch status due to a system error'
      }, { status: 500 });
    }
    
    // Send notifications for critical status changes
    const notificationStatuses = [
      'PICKUP_COMPLETE',
      'EN_ROUTE_TO_DELIVERY',
      'ARRIVED_AT_DELIVERY',
      'DELIVERY_COMPLETE',
      'DELAYED',
      'FAILED'
    ];
    
    if (notificationStatuses.includes(updateData.status)) {
      try {
        // Send notification to customer
        const customerNotification = await sendStatusNotification(
          updateData.status,
          updateData.dispatchId,
          updateData.orderId,
          'CUSTOMER'
        );
        
        if (!customerNotification.success) {
          // Log notification error but don't fail the status update
          const notificationError = new DispatchSystemError(
            customerNotification.error || 'Failed to send customer notification',
            'DRIVER_NOTIFICATION_ERROR',
            {
              dispatchId: updateData.dispatchId,
              driverId: updateData.driverId,
              orderId: updateData.orderId,
              notificationDetails: {
                type: 'status_update',
                recipient: 'customer'
              }
            }
          );
          
          trackDispatchError(notificationError, notificationError.type, notificationError.context);
        }
        
        // For delivery complete, failed, or delayed statuses, also notify admin
        if (['DELIVERY_COMPLETE', 'FAILED', 'DELAYED'].includes(updateData.status)) {
          const adminNotification = await sendStatusNotification(
            updateData.status,
            updateData.dispatchId,
            updateData.orderId,
            'ADMIN'
          );
          
          if (!adminNotification.success) {
            // Log notification error but don't fail the status update
            const notificationError = new DispatchSystemError(
              adminNotification.error || 'Failed to send admin notification',
              'DRIVER_NOTIFICATION_ERROR',
              {
                dispatchId: updateData.dispatchId,
                driverId: updateData.driverId,
                orderId: updateData.orderId,
                notificationDetails: {
                  type: 'status_update',
                  recipient: 'admin'
                }
              }
            );
            
            trackDispatchError(notificationError, notificationError.type, notificationError.context);
          }
        }
      } catch (error) {
        // Log notification error but don't fail the status update
        const notificationError = new DispatchSystemError(
          error instanceof Error ? error.message : 'Notification system error',
          'DRIVER_NOTIFICATION_ERROR',
          {
            dispatchId: updateData.dispatchId,
            driverId: updateData.driverId,
            orderId: updateData.orderId,
            notificationDetails: {
              type: 'status_update',
              recipient: 'multiple'
            }
          }
        );
        
        trackDispatchError(notificationError, notificationError.type, notificationError.context);
      }
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      dispatchId: updateData.dispatchId,
      status: updateData.status,
      timestamp: updateData.timestamp
    });
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in dispatch status update:', error);
    
    const dispatchId = typeof error === 'object' && error !== null && 'dispatchId' in error
      ? String(error.dispatchId)
      : 'unknown';
      
    const unexpectedError = new DispatchSystemError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'STATUS_UPDATE_FAILED',
      {
        dispatchId,
        deliveryStatus: 'UNKNOWN'
      }
    );
    
    trackDispatchError(unexpectedError, unexpectedError.type, unexpectedError.context);
    
    return NextResponse.json({
      error: 'An unexpected error occurred while updating the dispatch status'
    }, { status: 500 });
  }
} 