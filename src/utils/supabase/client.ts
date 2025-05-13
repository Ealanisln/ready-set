// src/utils/supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { type CookieOptions } from '@supabase/ssr'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a singleton instance
let supabaseInstance: SupabaseClient | null = null;

const getStorageCookie = (name: string) => {
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
    return cookie ? cookie.split('=')[1] : null
  } catch (e) {
    return null
  }
}

const setStorageCookie = (name: string, value: string, options: CookieOptions = {}) => {
  try {
    let cookieString = `${name}=${value}; path=${options.path || '/'}`
    if (options.maxAge) cookieString += `; max-age=${options.maxAge}`
    if (options.domain) cookieString += `; domain=${options.domain}`
    if (options.secure) cookieString += '; secure'
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`
    document.cookie = cookieString
  } catch (e) {
    console.error('Error setting cookie:', e)
  }
}

const removeStorageCookie = (name: string, options: CookieOptions = {}) => {
  try {
    setStorageCookie(name, '', { ...options, maxAge: -1 })
  } catch (e) {
    console.error('Error removing cookie:', e)
  }
}

/**
 * Creates a Supabase client for browser environments
 */
export const createClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get: (name: string) => getStorageCookie(name),
          set: (name: string, value: string, options: CookieOptions) => 
            setStorageCookie(name, value, options),
          remove: (name: string, options: CookieOptions) => 
            removeStorageCookie(name, options)
        },
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          autoRefreshToken: true,
          persistSession: true
        }
      });
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      throw error;
    }
  }
  return supabaseInstance;
};

/**
 * Clears all Supabase-related cookies for auth recovery
 */
export const clearSupabaseCookies = () => {
  const cookieOptions: CookieOptions = {
    path: '/',
    domain: window.location.hostname,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  };

  try {
    // Clear all potential Supabase cookies
    const cookieNames = [
      'supabase-auth-token',
      'sb-access-token',
      'sb-refresh-token', 
      'sb-provider-token',
      'sb-auth-token',
      'pkce-verifier',
      'sb-token',
      'sb-refresh-token'
    ];
    
    cookieNames.forEach(name => {
      removeStorageCookie(name, cookieOptions);
    });
    
    // Also clear local storage items
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }

    console.log('Cleared Supabase cookies and storage for auth recovery');
  } catch (error) {
    console.error('Error clearing cookies:', error);
  }
};

/**
 * Attempts to recover from auth errors by clearing cookies and refreshing the session
 */
export const retryAuth = async () => {
  try {
    clearSupabaseCookies();
    supabaseInstance = null;
    const supabase = createClient();
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error during retry:', error);
      return { success: false, error };
    }
    
    return { success: !!data.session, session: data.session };
  } catch (error) {
    console.error('Retry auth error:', error);
    return { success: false, error };
  }
};