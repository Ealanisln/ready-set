import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DispatchSystemError, trackDispatchError } from '@/utils/domain-error-tracking';

// Driver assignment validation schema
const driverAssignmentSchema = z.object({
  orderId: z.string(),
  driverId: z.string(),
  estimatedPickupTime: z.string().datetime(),
  currentLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

// Validate the driver's location update
const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  heading: z.number().optional(),
  speed: z.number().optional(),
  timestamp: z.string().datetime().optional(),
});

type LocationUpdate = z.infer<typeof locationUpdateSchema>;

// Mock function to check driver's status
async function checkDriverStatus(driverId: string) {
  // Simulated driver status check
  const statuses = ['ACTIVE', 'OFFLINE', 'ON_DELIVERY', 'ON_BREAK'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  
  return {
    status: statuses[randomIndex],
    lastSeen: new Date().toISOString(),
    activeDeliveries: randomIndex === 2 ? 1 : 0,
  };
}

// Mock function to validate tracking system compatibility
function validateTrackingSystem(locationData: LocationUpdate) {
  // Simulate validation of the tracking system data
  const isValid = Math.random() > 0.1;
  
  if (!isValid) {
    return {
      valid: false,
      reason: 'Location data format incompatible with tracking system'
    };
  }
  
  return { valid: true };
}

// Mock function to get available orders near driver location
async function getAvailableOrdersNear(location: LocationUpdate) {
  // Simulate database query for orders near the driver
  const ordersCount = Math.floor(Math.random() * 5);
  
  const orders = Array.from({ length: ordersCount }).map((_, index) => ({
    id: `order_${Math.floor(Math.random() * 1000000)}`,
    pickupAddress: '123 Main St, Anytown, USA',
    dropoffAddress: `${Math.floor(Math.random() * 999)} Oak St, Anytown, USA`,
    estimatedDistance: (Math.random() * 10).toFixed(2) + ' km',
    estimatedTime: Math.floor(Math.random() * 30) + 5 + ' min',
    orderValue: '$' + (Math.floor(Math.random() * 50) + 10).toFixed(2),
  }));
  
  return orders;
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const driverId = params.id;
  
  try {
    // Get query parameters for location
    const url = new URL(req.url);
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
    
    if (!lat || !lng) {
      const error = new DispatchSystemError(
        'Location parameters missing',
        'LOCATION_TRACKING_ERROR',
        {
          driverId,
          location: { lat: undefined, lng: undefined }
        }
      );
      
      trackDispatchError(error, error.type, error.context);
      
      return NextResponse.json({ 
        error: 'Location parameters (lat, lng) are required'
      }, { status: 400 });
    }
    
    // Parse and validate location update
    let locationUpdate: LocationUpdate;
    try {
      locationUpdate = locationUpdateSchema.parse({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        accuracy: url.searchParams.get('accuracy') 
          ? parseFloat(url.searchParams.get('accuracy')!) 
          : undefined,
        heading: url.searchParams.get('heading') 
          ? parseFloat(url.searchParams.get('heading')!) 
          : undefined,
        speed: url.searchParams.get('speed') 
          ? parseFloat(url.searchParams.get('speed')!) 
          : undefined,
        timestamp: url.searchParams.get('ts') || new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const dispatchError = new DispatchSystemError(
          'Invalid location data format',
          'LOCATION_TRACKING_ERROR',
          {
            driverId,
            location: { 
              lat: parseFloat(lat), 
              lng: parseFloat(lng)
            }
          }
        );
        
        trackDispatchError(dispatchError, dispatchError.type, dispatchError.context);
        
        return NextResponse.json({ 
          error: 'Location data validation failed', 
          details: error.format() 
        }, { status: 400 });
      }
      
      throw error; // Re-throw unexpected errors
    }
    
    // Verify driver is active and eligible for assignments
    const driverStatus = await checkDriverStatus(driverId);
    if (driverStatus.status !== 'ACTIVE') {
      const error = new DispatchSystemError(
        `Driver is not active (current status: ${driverStatus.status})`,
        'DRIVER_ASSIGNMENT_FAILED',
        {
          driverId,
          deliveryStatus: driverStatus.status,
          location: { 
            lat: locationUpdate.latitude, 
            lng: locationUpdate.longitude 
          }
        }
      );
      
      trackDispatchError(error, error.type, error.context);
      
      return NextResponse.json({ 
        error: 'Driver must be active to receive assignments',
        currentStatus: driverStatus.status
      }, { status: 403 });
    }
    
    // Validate compatibility with our tracking system
    const trackingValidation = validateTrackingSystem(locationUpdate);
    if (!trackingValidation.valid) {
      const error = new DispatchSystemError(
        trackingValidation.reason || 'Tracking system validation failed',
        'LOCATION_TRACKING_ERROR',
        {
          driverId,
          location: { 
            lat: locationUpdate.latitude, 
            lng: locationUpdate.longitude 
          }
        }
      );
      
      trackDispatchError(error, error.type, error.context);
      
      return NextResponse.json({ 
        error: trackingValidation.reason 
      }, { status: 400 });
    }
    
    // Get available orders near driver location
    let availableOrders;
    try {
      availableOrders = await getAvailableOrdersNear(locationUpdate);
    } catch (error) {
      const etaError = new DispatchSystemError(
        'Failed to calculate nearby available orders',
        'ETA_CALCULATION_ERROR',
        {
          driverId,
          location: { 
            lat: locationUpdate.latitude, 
            lng: locationUpdate.longitude 
          }
        }
      );
      
      trackDispatchError(etaError, etaError.type, etaError.context);
      
      return NextResponse.json({ 
        error: 'Failed to find available orders',
        driverLocation: {
          latitude: locationUpdate.latitude,
          longitude: locationUpdate.longitude
        }
      }, { status: 500 });
    }
    
    // Return driver assignments
    return NextResponse.json({
      driverId,
      timestamp: new Date().toISOString(),
      location: {
        latitude: locationUpdate.latitude,
        longitude: locationUpdate.longitude
      },
      availableOrders,
      driverStatus: driverStatus.status
    });
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in driver assignments:', error);
    
    let dispatchError: DispatchSystemError;
    
    if (error instanceof DispatchSystemError) {
      dispatchError = error;
    } else {
      dispatchError = new DispatchSystemError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'DRIVER_ASSIGNMENT_FAILED',
        {
          driverId,
          deliveryStatus: 'UNKNOWN'
        }
      );
    }
    
    trackDispatchError(dispatchError, dispatchError.type, dispatchError.context);
    
    return NextResponse.json({ 
      error: 'Failed to process driver assignments' 
    }, { status: 500 });
  }
}

// Endpoint to accept/reject a specific order assignment
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const driverId = params.id;
  
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.orderId) {
      const error = new DispatchSystemError(
        'Missing orderId in request',
        'DRIVER_ASSIGNMENT_FAILED',
        { driverId }
      );
      
      trackDispatchError(error, error.type, error.context);
      
      return NextResponse.json({ 
        error: 'Order ID is required' 
      }, { status: 400 });
    }
    
    if (!body.action || !['accept', 'reject'].includes(body.action)) {
      const error = new DispatchSystemError(
        'Invalid action for assignment',
        'DRIVER_ASSIGNMENT_FAILED',
        { 
          driverId,
          orderId: body.orderId 
        }
      );
      
      trackDispatchError(error, error.type, error.context);
      
      return NextResponse.json({ 
        error: 'Action must be either "accept" or "reject"' 
      }, { status: 400 });
    }
    
    const orderId = body.orderId;
    const action = body.action;
    
    // Process driver's response (simulate)
    // Random failure for testing error handling
    if (Math.random() < 0.1) {
      const error = new DispatchSystemError(
        'Failed to update driver assignment',
        'DRIVER_ASSIGNMENT_FAILED',
        { 
          driverId,
          orderId,
          deliveryStatus: action === 'accept' ? 'ASSIGNED' : 'AVAILABLE'
        }
      );
      
      trackDispatchError(error, error.type, error.context);
      
      return NextResponse.json({ 
        error: 'Failed to process assignment update' 
      }, { status: 500 });
    }
    
    // Success response
    return NextResponse.json({
      success: true,
      driverId,
      orderId,
      action,
      timestamp: new Date().toISOString(),
      status: action === 'accept' ? 'ASSIGNED' : 'REJECTED'
    });
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in assignment update:', error);
    
    const dispatchError = new DispatchSystemError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'DRIVER_ASSIGNMENT_FAILED',
      { driverId }
    );
    
    trackDispatchError(dispatchError, dispatchError.type, dispatchError.context);
    
    return NextResponse.json({ 
      error: 'Failed to process assignment update' 
    }, { status: 500 });
  }
} 