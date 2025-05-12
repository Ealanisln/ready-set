import { NextRequest, NextResponse } from 'next/server';
import { serverLogger } from '@/utils/server-logger';

type AuthRouteType = 
  | 'register'
  | 'login'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'refresh-token';

interface AuthMiddlewareOptions {
  routeType: AuthRouteType;
}

/**
 * Authentication route middleware with logging
 */
export function withAuthLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: AuthMiddlewareOptions
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Get route information for logging
    const { routeType } = options;
    const url = new URL(req.url);
    const path = url.pathname;
    
    try {
      // Log the request
      serverLogger.info(
        `Auth ${routeType} request received`,
        'auth',
        { path, method: req.method },
        req
      );
      
      // Execute the handler
      const response = await handler(req);
      
      // Log successful response
      if (response.status >= 200 && response.status < 300) {
        serverLogger.info(
          `Auth ${routeType} successful`,
          'auth',
          { path, method: req.method, status: response.status },
          req
        );
      } else {
        // Log non-2xx responses
        serverLogger.warn(
          `Auth ${routeType} returned status ${response.status}`,
          'auth',
          { path, method: req.method, status: response.status },
          req
        );
      }
      
      return response;
    } catch (error) {
      // Log error with detailed context
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      serverLogger.error(
        `Auth ${routeType} error: ${errorMessage}`,
        'auth',
        error,
        { path, method: req.method, routeType },
        req
      );
      
      // Return an appropriate error response
      const statusCode = 
        // Authentication errors usually return 401
        errorMessage.includes('unauthorized') || errorMessage.includes('authentication') 
          ? 401 
        // Input validation errors usually return 400  
        : errorMessage.includes('validation') || errorMessage.includes('invalid') 
          ? 400 
        // Default to server error  
        : 500;
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }
  };
} 