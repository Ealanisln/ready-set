import { H } from 'highlight.run';
import { NextRequest } from 'next/server';
import { serverLogger } from './server-logger';

/**
 * Track authentication redirects and issues for better debugging
 * Use in middleware and getServerSideProps/Server Components 
 */
export function trackAuthRedirect(
  from: string,
  to: string,
  reason: 'unauthenticated' | 'unauthorized' | 'expired' | 'invalid_session' | 'other',
  details?: Record<string, any>
) {
  // Only track in client-side code where Highlight is available
  if (typeof window !== 'undefined' && window.H) {
    try {
      H.track('auth_redirect', {
        from,
        to,
        reason,
        timestamp: new Date().toISOString(),
        details,
        // Get current URL parameters if available
        params: typeof window !== 'undefined' 
          ? Object.fromEntries(new URLSearchParams(window.location.search)) 
          : {}
      });
    } catch (err) {
      console.error('Failed to track auth redirect:', err);
    }
  }
}

/**
 * Track server-side authentication checks for protected routes
 * Can be used in server components and API routes
 */
export function logAuthCheck(
  request: NextRequest | Request, 
  result: 'success' | 'failure',
  reason?: string,
  userId?: string
) {
  try {
    // Extract URL info
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Server-side logging
    serverLogger.info(
      `Auth check: ${result}${reason ? ` (${reason})` : ''}`, 
      'auth',
      {
        path: pathname,
        userId,
        result,
        reason,
        query: Object.fromEntries(url.searchParams)
      },
      request as any
    );
    
    // If it's a failure and we know where the redirect is going
    if (result === 'failure' && reason) {
      const redirectUrl = '/sign-in?returnTo=' + encodeURIComponent(pathname);
      
      // Log the redirect specifically
      serverLogger.warn(
        `Auth redirect from ${pathname} to ${redirectUrl}`,
        'auth',
        {
          from: pathname,
          to: redirectUrl,
          reason
        },
        request as any
      );
    }
  } catch (err) {
    console.error('Error in logAuthCheck:', err);
  }
}

/**
 * Enhanced authentication middleware wrapper with logging
 */
export function withAuthLogging<T extends (...args: any[]) => any>(
  handler: T,
  options: {
    routeName: string;
    requiresAuth: boolean;
  }
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const [req, ...rest] = args;
    
    // Log the authentication check
    if (options.requiresAuth) {
      try {
        logAuthCheck(
          req, 
          'success', // Assume success since we're about to execute the handler
          undefined,
          req.userId // If available in your request object
        );
      } catch (e) {
        console.error('Failed to log auth check:', e);
      }
    }
    
    // Execute the original handler
    return handler(req, ...rest);
  };
} 