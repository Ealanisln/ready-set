import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OrderManagementError, OrderErrorType, trackOrderError } from '@/utils/domain-error-tracking';

// Order validation schema
const orderSchema = z.object({
  customerId: z.string().uuid(),
  orderType: z.enum(['DELIVERY', 'PICKUP']),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().positive(),
      specialInstructions: z.string().optional(),
    })
  ),
  deliveryAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default('US')
  }).optional(),
  scheduledTime: z.string().datetime().optional(),
  promoCode: z.string().optional(),
});

type OrderRequest = z.infer<typeof orderSchema>;

// Helper functions for order processing
async function validateOrderItems(items: OrderRequest['items']) {
  // Simulate validation against inventory
  const unavailableItems = [];
  
  for (const item of items) {
    // Simulate an inventory check
    const available = Math.random() > 0.2;
    
    if (!available) {
      unavailableItems.push(item.id);
    }
  }
  
  return {
    valid: unavailableItems.length === 0,
    unavailableItems
  };
}

async function calculateOrderPricing(order: OrderRequest) {
  try {
    // Simulate pricing calculation
    const basePrice = order.items.reduce((total, item) => {
      // Simulated item price logic
      const itemPrice = Math.floor(Math.random() * 10) + 5;
      return total + (itemPrice * item.quantity);
    }, 0);
    
    // Apply delivery fee if applicable
    const deliveryFee = order.orderType === 'DELIVERY' ? 4.99 : 0;
    
    // Apply discount from promo code if applicable
    let discountAmount = 0;
    if (order.promoCode) {
      // Simulate promo code validation
      if (order.promoCode === 'INVALID') {
        throw new OrderManagementError(
          'Invalid promo code',
          'PRICING_CALCULATION_ERROR',
          {
            customerId: order.customerId,
            orderType: order.orderType,
            pricing: {
              calculatedAmount: basePrice + deliveryFee,
              currency: 'USD'
            }
          }
        );
      }
      
      discountAmount = basePrice * 0.1; // 10% discount
    }
    
    // Calculate tax (simulated)
    const taxRate = 0.0725;
    const subtotal = basePrice + deliveryFee - discountAmount;
    const tax = subtotal * taxRate;
    
    const total = subtotal + tax;
    
    return {
      basePrice,
      deliveryFee,
      discountAmount,
      subtotal,
      tax,
      total,
      currency: 'USD'
    };
  } catch (error) {
    if (error instanceof OrderManagementError) {
      throw error;
    }
    
    throw new OrderManagementError(
      'Failed to calculate order pricing',
      'PRICING_CALCULATION_ERROR',
      {
        customerId: order.customerId,
        orderType: order.orderType,
        pricing: {
          calculatedAmount: 0,
          currency: 'USD'
        }
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const orderResult = orderSchema.safeParse(body);
    
    if (!orderResult.success) {
      // Extract validation errors from Zod
      const validationErrors = orderResult.error.format();
      
      // Create error with context for tracking
      const error = new OrderManagementError(
        'Order validation failed',
        'VALIDATION_ERROR',
        {
          customerId: body.customerId || 'unknown',
          orderType: body.orderType,
          validationErrors
        }
      );
      
      // Track the error with Highlight.io
      trackOrderError(error, error.type, error.context);
      
      // Return appropriate error response
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }
    
    const orderData = orderResult.data;
    
    // Check item availability
    const itemValidation = await validateOrderItems(orderData.items);
    if (!itemValidation.valid) {
      const error = new OrderManagementError(
        'Some items are unavailable',
        'VALIDATION_ERROR',
        {
          customerId: orderData.customerId,
          orderType: orderData.orderType,
          validationErrors: {
            unavailableItems: itemValidation.unavailableItems
          }
        }
      );
      
      trackOrderError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Some items are unavailable',
        unavailableItems: itemValidation.unavailableItems
      }, { status: 400 });
    }
    
    // Calculate pricing
    let pricing;
    try {
      pricing = await calculateOrderPricing(orderData);
    } catch (error) {
      if (error instanceof OrderManagementError) {
        trackOrderError(error, error.type, error.context);
        
        return NextResponse.json({
          error: error.message
        }, { status: 400 });
      }
      
      // For unexpected errors
      const unexpectedError = new OrderManagementError(
        'Unexpected error during pricing calculation',
        'PRICING_CALCULATION_ERROR',
        {
          customerId: orderData.customerId,
          orderType: orderData.orderType
        }
      );
      
      trackOrderError(unexpectedError, unexpectedError.type, unexpectedError.context);
      
      return NextResponse.json({
        error: 'Failed to process order pricing'
      }, { status: 500 });
    }
    
    // Create order in database (simulated)
    const orderId = `order_${Math.floor(Math.random() * 1000000)}`;
    
    // Simulate random order creation failure
    if (Math.random() < 0.1) {
      const error = new OrderManagementError(
        'Database error while creating order',
        'ORDER_CREATION_FAILED',
        {
          customerId: orderData.customerId,
          orderType: orderData.orderType,
          pricing: {
            calculatedAmount: pricing.total,
            currency: pricing.currency
          }
        }
      );
      
      trackOrderError(error, error.type, error.context);
      
      return NextResponse.json({
        error: 'Failed to create order due to a system error'
      }, { status: 500 });
    }
    
    // Return successful response
    return NextResponse.json({
      success: true,
      orderId,
      orderDetails: {
        ...orderData,
        pricing
      }
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in order creation:', error);
    
    // If it's already our domain error type, use it directly
    if (error instanceof OrderManagementError) {
      trackOrderError(error, error.type, error.context);
      
      return NextResponse.json({
        error: error.message
      }, { status: 500 });
    }
    
    // For completely unexpected errors
    const unexpectedError = new OrderManagementError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'ORDER_CREATION_FAILED',
      {
        attemptedAction: 'create_order'
      }
    );
    
    trackOrderError(unexpectedError, unexpectedError.type, unexpectedError.context);
    
    return NextResponse.json({
      error: 'An unexpected error occurred while processing your order'
    }, { status: 500 });
  }
} 