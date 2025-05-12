'use client'

import { ErrorBoundary } from '@highlight-run/next/client'
import { ReactNode, useEffect } from 'react'
import { H } from 'highlight.run'
import { CONSTANTS } from '@/constants'

// Enhanced error fallback component with detailed error reporting
function ErrorFallback({ error, resetError }: { error: Error, resetError: () => void }) {
  // Report the error to Highlight when the fallback renders
  useEffect(() => {
    try {
      // Report the error directly to Highlight
      H.consumeError(error);
      
      // Also track additional context as an event
      H.track('highlight_error_boundary_fallback', {
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString()
      });
      
      console.error('Error caught by HighlightErrorBoundary:', error);
    } catch (highlightError) {
      console.error('Failed to report error to Highlight:', highlightError);
    }
  }, [error]);

  return (
    <div className="p-4 border border-red-300 rounded-md bg-red-50 my-4">
      <h2 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-red-600">{error.message}</p>
      {error.stack && (
        <pre className="mt-2 text-xs max-h-48 overflow-auto bg-red-100 p-2 rounded text-red-700">
          {error.stack}
        </pre>
      )}
      <div className="mt-4 flex space-x-4">
        <button 
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}

export function HighlightErrorBoundary({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Ensure Highlight is properly initialized
    if (typeof window !== 'undefined' && !(window.H as any)?.__initialized) {
      try {
        H.init(CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
          debug: true,
          networkRecording: {
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: ['/api/auth', '/api/login'],
          }
        });
        (window.H as any).__initialized = true;
      } catch (err) {
        console.error('Failed to initialize Highlight in ErrorBoundary:', err);
      }
    }
  }, []);

  return (
    <ErrorBoundary 
      showDialog 
      fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
} 