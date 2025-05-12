'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { H } from 'highlight.run';
import { CONSTANTS } from '@/constants';

/**
 * Component that detects authentication redirects and reports them to Highlight
 * Place this component in your sign-in page or layout
 */
export default function AuthRedirectTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    // Ensure Highlight is initialized for error tracking
    if (typeof window !== 'undefined' && !(window.H as any)?.__initialized) {
      try {
        H.init(CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
          debug: true,
          networkRecording: {
            enabled: true
          }
        });
        (window.H as any).__initialized = true;
      } catch (err) {
        console.error('Failed to initialize Highlight in AuthRedirectTracker:', err);
      }
    }
    
    // Check if this is a redirect from a protected page
    const returnTo = searchParams.get('returnTo');
    
    if (pathname === '/sign-in' && returnTo) {
      try {
        // Track the auth redirect event
        H.track('auth_redirect_detected', {
          from: returnTo,
          to: pathname,
          timestamp: new Date().toISOString(),
          reason: 'unauthenticated',
          fullUrl: window.location.href,
          referrer: document.referrer || 'unknown'
        });
        
        // Add navigation listener so we can detect when the user successfully logs in and navigates
        const handleNavigation = () => {
          if (returnTo && pathname !== '/sign-in') {
            H.track('auth_redirect_successful_navigation', {
              from: '/sign-in',
              to: pathname,
              originalFrom: returnTo,
              timestamp: new Date().toISOString()
            });
          }
        };
        
        // This is a simplified approach - in a real app you'd need a more complex setup
        // to track navigation after login
        setTimeout(() => {
          if (pathname !== '/sign-in') {
            handleNavigation();
          }
        }, 5000);
        
        console.log(`Auth redirect detected: ${returnTo} → ${pathname}`);
      } catch (err) {
        console.error('Failed to track auth redirect:', err);
      }
    }
    
    // Also track sign-in page views to correlate with redirects
    try {
      if (typeof window !== 'undefined' && window.H) {
        H.track('sign_in_page_view', {
          hasReturnTo: !!returnTo,
          returnTo: returnTo || undefined,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'unknown'
        });
      }
    } catch (err) {
      console.error('Failed to track sign-in page view:', err);
    }
    
    // Listen for unhandled auth errors from other components
    const handleError = (event: ErrorEvent) => {
      if (event.error && 
          (event.error.message?.includes('auth') || 
           event.error.message?.includes('login') ||
           event.error.message?.includes('authentication') ||
           event.error.message?.includes('sign in'))
      ) {
        try {
          H.track('auth_error_detected', {
            message: event.error.message,
            stack: event.error.stack,
            timestamp: new Date().toISOString(),
            pathname
          });
        } catch (err) {
          console.error('Failed to track auth error:', err);
        }
      }
    };
    
    // Add error listener
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [pathname, searchParams]);
  
  // This component doesn't render anything
  return null;
} 