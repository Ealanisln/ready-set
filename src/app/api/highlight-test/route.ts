import { NextRequest, NextResponse } from 'next/server';
import { CONSTANTS } from '@/constants';
import { serverLogger } from '@/utils/server-logger';
import { handleApiError } from '@/utils/error-logging';

// API route to test Highlight error tracking
async function handler(
  request: Request,
  context: { params: Promise<Record<string, string>> }
) {
  const nextRequest = request as unknown as NextRequest; // Cast for our utility functions
  const url = new URL(request.url);
  const shouldError = url.searchParams.has('error');
  const isFatal = url.searchParams.has('fatal');
  
  try {
    // Log request
    serverLogger.info(
      'Highlight test API call received', 
      'api',
      { 
        test: true, 
        shouldError, 
        isFatal,
        query: Object.fromEntries(url.searchParams)
      },
      nextRequest
    );
    
    // Check if we should generate an error for testing
    if (shouldError) {
      serverLogger.warn('Intentional error about to be thrown', 'api', { test: true }, nextRequest);
      
      if (isFatal) {
        // This will crash without being caught by the try/catch
        throw new Error('Fatal test error from /api/highlight-test');
      } else {
        // This will be caught
        throw new Error('Test error from /api/highlight-test');
      }
    }
    
    // Normal successful response
    return NextResponse.json({ 
      message: 'Highlight test endpoint working normally',
      timestamp: new Date().toISOString(),
      path: url.pathname,
      success: true
    });
  } catch (error) {
    // Use our error handling utility to log and format the response
    return handleApiError(error, 'api:other', nextRequest, {
      testMode: true,
      path: url.pathname
    });
  }
}

// Direct export of the handler without Highlight wrapper
// This eliminates the dependency on @highlight-run/node in this route
export const GET = handler; 