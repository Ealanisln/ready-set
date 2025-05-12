"use client";

import { H } from 'highlight.run';
import { CONSTANTS } from '@/constants';

/**
 * Initialize Highlight for auth tracking
 */
function ensureHighlightInitialized() {
  if (typeof window !== 'undefined') {
    if (!(window.H as any)?.__initialized) {
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
        console.error('Failed to initialize Highlight for auth logging:', err);
      }
    }
    return (window.H as any)?.__initialized || false;
  }
  return false;
}

/**
 * Log authentication errors with Highlight
 */
export function logAuthError(
  error: Error | string,
  context: {
    action: 'login' | 'signup' | 'logout' | 'password-reset' | 'email-verification';
    email?: string;
    returnTo?: string;
    additionalInfo?: Record<string, any>;
  }
) {
  if (!ensureHighlightInitialized()) return;
  
  // Create error object if string
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  try {
    // Report the error to Highlight
    H.consumeError(errorObj);
    
    // Also track as an event for better filtering and context
    H.track('auth_error', {
      action: context.action,
      message: errorObj.message,
      stack: errorObj.stack,
      email: context.email ? maskEmail(context.email) : undefined,
      returnTo: context.returnTo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...context.additionalInfo
    });
  } catch (err) {
    console.error('Failed to log auth error to Highlight:', err);
  }
}

/**
 * Track successful authentication events
 */
export function trackAuthSuccess(context: {
  action: 'login' | 'signup' | 'logout' | 'password-reset' | 'email-verification';
  userType?: string;
  email?: string;
  returnTo?: string;
  redirectTo?: string;
  additionalInfo?: Record<string, any>;
}) {
  if (!ensureHighlightInitialized()) return;
  
  try {
    H.track('auth_success', {
      action: context.action,
      userType: context.userType,
      email: context.email ? maskEmail(context.email) : undefined,
      returnTo: context.returnTo,
      redirectTo: context.redirectTo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...context.additionalInfo
    });
  } catch (err) {
    console.error('Failed to track auth success in Highlight:', err);
  }
}

/**
 * Mask email for privacy while still keeping some identifiable parts
 */
function maskEmail(email: string): string {
  if (!email || email.length < 5 || !email.includes('@')) return 'invalid-email';
  
  const [username, domain] = email.split('@');
  
  // Keep first 2 characters and last character of username
  const maskedUsername = username.charAt(0) + 
    (username.length > 2 ? '*'.repeat(username.length - 2) + username.charAt(username.length - 1) : '*');
  
  // Keep domain for analytics
  return `${maskedUsername}@${domain}`;
} 