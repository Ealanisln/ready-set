import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Import with a different name to avoid conflicts
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');
  const next = requestUrl.searchParams.get('next') || '/';
  
  if (token) {
    try {
      // Verify the magic link token using the auth handler
      const response = await auth.handler(request);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Magic link verification error:', error);
        // Redirect to auth error page with the error message
        return NextResponse.redirect(
          new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }
      
      // Successful verification - redirect to home or requested page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error: any) {
      console.error('Auth callback error:', error);
      // Redirect to auth error page
      return NextResponse.redirect(
        new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
  }
  
  // If no token is present, redirect to sign in page
  return NextResponse.redirect(new URL('/auth/sign-in', requestUrl.origin));
}