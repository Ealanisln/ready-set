import { H } from 'highlight.run';
import { NextRequest, NextResponse } from 'next/server';

type ErrorSource = 
  | 'auth:register' 
  | 'auth:login' 
  | 'auth:forgot-password' 
  | 'auth:reset-password' 
  | 'auth:verify-email'
  | 'auth:refresh-token'
  | 'catering:create'
  | 'catering:update'
  | 'catering:cancel'
  | 'catering:status'
  | 'catering:assign-driver'
  | 'api:other';

interface ErrorDetails {
  message: string;
  source: ErrorSource;
  statusCode?: number;
  userId?: string;
  requestData?: Record<string, any>;
  additionalContext?: Record<string, any>;
}

/**
 * Log an error to Highlight and console
 */
export function logError(error: Error | unknown, details: ErrorDetails): void {
  // Ensure the error is an Error object
  const errorObject = error instanceof Error ? error : new Error(String(error));
  
  // Prepare context for tracking
  const context = {
    source: details.source,
    message: details.message,
    statusCode: details.statusCode || 500,
    userId: details.userId,
    timestamp: new Date().toISOString(),
    // Safely sanitize request data by removing sensitive fields
    requestData: sanitizeRequestData(details.requestData),
    ...details.additionalContext
  };
  
  // Log to console first (always available)
  console.error(`[${details.source}] ${details.message}`, {
    error: errorObject,
    context
  });
  
  // Only attempt to use Highlight in browser environment
  if (typeof window !== 'undefined' && window.H) {
    try {
      // Report the error to Highlight
      window.H.consumeError(errorObject);
      
      // Also track as an event for better filtering
      window.H.track(`error_${details.source.replace(':', '_')}`, context);
    } catch (highlightError) {
      console.error('Failed to report error to Highlight:', highlightError);
    }
  }
}

/**
 * Handles API route errors with proper response formatting and logging
 */
export function handleApiError(
  error: Error | unknown, 
  source: ErrorSource,
  req: NextRequest,
  contextData?: Record<string, any>
): NextResponse {
  // Extract message and status
  const isAxiosError = !!(error as any)?.response;
  const statusCode = isAxiosError 
    ? (error as any).response.status 
    : (error as any)?.statusCode || 500;
  
  const message = (error instanceof Error) 
    ? error.message 
    : isAxiosError 
      ? `${(error as any).response.statusText}: ${JSON.stringify((error as any).response.data)}` 
      : String(error);
  
  // Try to extract request data to include in logs (but sanitize sensitive information)
  let requestData: Record<string, any> = {};
  try {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      // Clone the request to avoid consuming the body stream
      const clone = req.clone();
      clone.json()
        .then(body => {
          requestData = sanitizeRequestData(body);
        })
        .catch(() => {
          // If body parsing fails, try to get URL parameters at minimum
          requestData = Object.fromEntries(new URL(req.url).searchParams);
        });
    } else {
      // For GET/DELETE, include query parameters
      requestData = Object.fromEntries(new URL(req.url).searchParams);
    }
  } catch (e) {
    console.error('Error parsing request data for logging:', e);
  }
  
  // Log the error with Highlight
  logError(error, {
    source,
    message,
    statusCode,
    requestData,
    additionalContext: {
      method: req.method,
      url: req.url,
      headers: sanitizeHeaders(req.headers),
      ...contextData
    }
  });
  
  // Return appropriate error response
  return NextResponse.json(
    { 
      error: message,
      code: statusCode 
    }, 
    { status: statusCode }
  );
}

/**
 * Remove sensitive information from request data
 */
function sanitizeRequestData(data?: Record<string, any>): Record<string, any> {
  if (!data) return {};
  
  const sanitized = { ...data };
  
  // List of sensitive fields to redact
  const sensitiveFields = [
    'password', 
    'newPassword', 
    'currentPassword',
    'token', 
    'accessToken', 
    'refreshToken',
    'secret',
    'authorization',
    'apiKey',
    'credit_card',
    'cardNumber',
    'cvv',
    'ssn'
  ];
  
  // Redact sensitive information
  Object.keys(sanitized).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeRequestData(sanitized[key]);
    }
  });
  
  return sanitized;
}

/**
 * Sanitize headers to remove sensitive information
 */
function sanitizeHeaders(headers: Headers): Record<string, string> {
  const sanitized: Record<string, string> = {};
  const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie'];
  
  headers.forEach((value, key) => {
    if (sensitiveHeaders.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
} 