'use client';

import { useEffect } from 'react';
import { H } from 'highlight.run';
import { CONSTANTS } from '@/constants';

// Force manual initialization of Highlight to ensure it works in admin sections
const initHighlight = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Reinitialize in case it didn't load properly before
    if (!(window.H as any)?.__initialized) {
      console.log('Manually initializing Highlight.run for admin section');
      H.init(
        CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, 
        { 
          debug: true,
          networkRecording: {
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: ['/api/auth', '/api/login'],
          }
        }
      );
      
      // Set flag on window object to track initialization
      (window.H as any).__initialized = true;
    }
    
    // Test event tracking
    H.track('highlight_admin_init', {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname,
      projectId: CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID
    });
    
    console.log('✅ Highlight.run initialized for admin section');
  } catch (err) {
    console.error('Failed to initialize Highlight:', err);
  }
};

export default function AdminHighlightInit() {
  useEffect(() => {
    // Initialize Highlight first
    initHighlight();
    
    // Set up explicit error handling for admin section
    if (typeof window !== 'undefined') {
      // Register a global error handler
      const originalOnError = window.onerror;
      window.onerror = function(
        message: string | Event, 
        source?: string, 
        lineno?: number, 
        colno?: number, 
        error?: Error
      ) {
        // Ensure Highlight is initialized
        if (!(window.H as any).__initialized) {
          initHighlight();
        }
        
        // Report to Highlight with enhanced context
        try {
          // Report with the error object if available
          if (error) {
            console.log('👁️ Reporting error to Highlight:', error.message);
            H.consumeError(error);
          } else {
            console.log('👁️ Reporting string error to Highlight:', String(message));
            H.consumeError(new Error(String(message)));
          }
          
          // Also track as an event with additional metadata
          H.track('admin_global_error', {
            message: String(message),
            source: source || 'unknown',
            lineno: lineno || 0,
            colno: colno || 0,
            url: window.location.href,
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            errorInfo: error ? {
              name: error.name,
              message: error.message,
              stack: error.stack || 'No stack available'
            } : 'No error object available'
          });
        } catch (highlightError) {
          console.error('Failed to report to Highlight:', highlightError);
        }
        
        // Call original handler if exists
        if (originalOnError) {
          return originalOnError.call(
            window, 
            message, 
            source, 
            lineno, 
            colno, 
            error
          );
        }
        
        // Return false to allow default browser handling
        return false;
      };
      
      // Capture unhandled promise rejections
      const originalOnUnhandledRejection = window.onunhandledrejection;
      window.onunhandledrejection = function(event: PromiseRejectionEvent) {
        // Ensure Highlight is initialized
        if (!(window.H as any).__initialized) {
          initHighlight();
        }
        
        // Report to Highlight
        try {
          console.log('👁️ Reporting unhandled rejection to Highlight:', event.reason);
          
          const error = event.reason instanceof Error 
            ? event.reason 
            : new Error(String(event.reason));
            
          H.consumeError(error);
          
          H.track('admin_unhandled_rejection', {
            reason: String(event.reason),
            stack: event.reason?.stack || 'No stack available',
            url: window.location.href,
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          });
        } catch (highlightError) {
          console.error('Failed to report rejection to Highlight:', highlightError);
        }
        
        // Call original handler if exists
        if (originalOnUnhandledRejection) {
          return originalOnUnhandledRejection.call(window, event);
        }
      };
      
      // Log successful initialization
      H.track('admin_highlight_initialized', {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        path: window.location.pathname
      });
    }
    
    return () => {
      // Clean up event listeners if needed
      if (typeof window !== 'undefined') {
        window.onerror = null;
        window.onunhandledrejection = null;
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
} 