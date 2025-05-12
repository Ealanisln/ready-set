import { NextRequest, NextResponse } from 'next/server';
import { serverLogger } from './server-logger';
import { logError } from './error-logging';
import { H } from 'highlight.run';

// Order-specific error types
export enum OrderErrorType {
  VALIDATION = 'validation',
  PAYMENT = 'payment',
  INVENTORY = 'inventory',
  DELIVERY = 'delivery',
  AUTHORIZATION = 'authorization',
  SYSTEM = 'system'
}

interface OrderError extends Error {
  type: OrderErrorType;
  orderId?: string;
  userId?: string;
  details?: Record<string, any>;
}

/**
 * Creates a typed order error with additional context
 */
export function createOrderError(
  message: string,
  type: OrderErrorType,
  details?: {
    orderId?: string;
    userId?: string;
    [key: string]: any;
  }
): OrderError {
  const error = new Error(message) as OrderError;
  error.type = type;
  error.orderId = details?.orderId;
  error.userId = details?.userId;
  error.details = details;
  return error;
}

/**
 * Handles order-related errors with proper logging and Highlight reporting
 */
export function handleOrderError(
  error: Error | unknown,
  req: NextRequest,
  contextData?: Record<string, any>
): NextResponse {
  // Try to extract order error details
  const orderError = error as OrderError;
  const isOrderError = orderError.type !== undefined;
  
  // Determine error source category for our logging system
  const source = isOrderError 
    ? `catering:${orderError.type}` as const
    : 'catering:create';
  
  // Prepare status code based on error type
  let statusCode = 500;
  if (isOrderError) {
    switch (orderError.type) {
      case OrderErrorType.VALIDATION:
        statusCode = 400;
        break;
      case OrderErrorType.AUTHORIZATION:
        statusCode = 403;
        break;
      case OrderErrorType.INVENTORY:
        statusCode = 409; // Conflict
        break;
      case OrderErrorType.PAYMENT:
        statusCode = 402; // Payment Required
        break;
      default:
        statusCode = 500;
    }
  }
  
  // Extract message
  const message = error instanceof Error 
    ? error.message 
    : String(error);
  
  // Log to server logs
  serverLogger.error(
    `Order error: ${message}`, 
    'catering',
    error,
    {
      orderId: isOrderError ? orderError.orderId : undefined,
      userId: isOrderError ? orderError.userId : undefined,
      errorType: isOrderError ? orderError.type : 'unknown',
      ...contextData
    },
    req
  );
  
  // Also use our client-side error logging (will only report in browser contexts)
  if (typeof window !== 'undefined' && window.H) {
    try {
      const errorObj = error instanceof Error ? error : new Error(message);
      
      // Report directly to Highlight
      H.consumeError(errorObj);
      
      // Also track as an event for better filtering and context
      H.track('order_error', {
        type: isOrderError ? orderError.type : 'unknown',
        orderId: isOrderError ? orderError.orderId : undefined,
        userId: isOrderError ? orderError.userId : undefined,
        message,
        path: req.nextUrl.pathname,
        timestamp: new Date().toISOString(),
        details: isOrderError ? orderError.details : undefined
      });
    } catch (highlightError) {
      console.error('Failed to report to Highlight:', highlightError);
    }
  }
  
  // Return appropriate response
  return NextResponse.json(
    {
      error: {
        message,
        type: isOrderError ? orderError.type : 'system',
        code: statusCode,
        orderId: isOrderError ? orderError.orderId : undefined
      }
    },
    { status: statusCode }
  );
} 