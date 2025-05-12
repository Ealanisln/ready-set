// src/components/ErrorBoundary/ErrorBoundary.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { H } from 'highlight.run';
import { CONSTANTS } from '@/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidMount(): void {
    // Ensure Highlight is initialized
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
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Report the error to Highlight.run if we're in a browser environment
    if (typeof window !== 'undefined') {
      try {
        // Ensure Highlight is initialized
        if (!(window.H as any)?.__initialized) {
          H.init(CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
            debug: true,
            networkRecording: {
              enabled: true,
              recordHeadersAndBody: true,
              urlBlocklist: ['/api/auth', '/api/login'],
            }
          });
          (window.H as any).__initialized = true;
        }
        
        // Pass the error directly to Highlight
        H.consumeError(error);
        
        // Also record additional error info as a custom event
        H.track('error_boundary_caught', {
          errorMessage: error.message,
          errorStack: error.stack,
          componentStack: errorInfo.componentStack,
          errorName: error.name,
          timeStamp: new Date().toISOString(),
          url: window.location.href,
          path: window.location.pathname,
          userAgent: navigator.userAgent
        });
      } catch (highlightError) {
        console.error('Failed to report error to Highlight.run:', highlightError);
      }
    }

    // Update state to include errorInfo
    this.setState({ errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center max-w-lg">
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <pre className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-xs my-4">
              {this.state.error?.stack || "No stack trace available"}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;