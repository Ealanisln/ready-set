'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthErrorRecovery from './SignIn/AuthErrorRecovery';

// Error messages we're looking for in logs
const COOKIE_PARSING_ERRORS = [
  "Failed to parse cookie string",
  "Unexpected token 'b', \"base64-",
  "is not valid JSON",
  "Malformed cookie value"
];

// Check if console.error has been called with a cookie parsing error
const detectCookieParsingError = () => {
  // Create a flag to track if we've seen the error
  let hasSeenCookieError = false;
  
  // Store the original console.error
  const originalConsoleError = console.error;
  
  // Override console.error to catch cookie parsing errors
  console.error = function(...args: any[]) {
    // Call the original console.error
    originalConsoleError.apply(console, args);
    
    // Check if any argument contains our error message
    const errorString = args.map(arg => String(arg)).join(' ');
    if (COOKIE_PARSING_ERRORS.some(errorMsg => errorString.includes(errorMsg))) {
      hasSeenCookieError = true;
      
      // Log the detection for debugging
      originalConsoleError.apply(console, ["Cookie parsing error detected by withAuthErrorHandler"]);
    }
  };
  
  // Return a function to check if we've seen the error
  // and restore the original console.error
  return () => {
    const result = hasSeenCookieError;
    console.error = originalConsoleError;
    return result;
  };
};

export function withAuthErrorHandler<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithAuthErrorHandler(props: P) {
    const [hasAuthError, setHasAuthError] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    
    useEffect(() => {
      // Check URL param first
      const cookieError = searchParams?.get('cookieError');
      if (cookieError === 'true') {
        setHasAuthError(true);
        return;
      }
      
      // Set up detection
      const checkForError = detectCookieParsingError();
      
      // Check after a short delay to catch any errors during mounting
      const timeoutId = setTimeout(() => {
        const detected = checkForError();
        if (detected) {
          console.log('Auth cookie error detected, showing recovery UI');
          
          // Update the URL to include the error parameter
          // This ensures the error state persists on page refresh
          const url = new URL(window.location.href);
          url.searchParams.set('cookieError', 'true');
          window.history.replaceState({}, '', url.toString());
          
          setHasAuthError(true);
        }
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }, [searchParams, router]);
    
    // If we've detected an auth error, show the recovery UI
    if (hasAuthError) {
      return <AuthErrorRecovery />;
    }
    
    // Otherwise, render the wrapped component
    return <Component {...props} />;
  };
}

export default withAuthErrorHandler; 