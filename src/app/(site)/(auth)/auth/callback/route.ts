import { NextResponse } from 'next/server';

// Import with a different name to avoid conflicts
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  
  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      
      // Exchange the auth code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth code exchange error:', error);
        // Redirect to auth error page
        return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
      }
      
      // Log the successful authentication
      console.log('Authentication successful:', data.session ? 'Session created' : 'No session created');
      
      // Successful auth - redirect to home or requested page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error) {
      console.error('Auth callback error:', error);
      // Redirect to auth error page
      return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
    }
  }
  
  // If no code is present, redirect to error page
  return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
}