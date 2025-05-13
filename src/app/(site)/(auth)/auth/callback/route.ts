import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';

// Define default home routes for each user type
const USER_HOME_ROUTES: Record<string, string> = {
  admin: "/admin",
  super_admin: "/admin",
  driver: "/driver",
  helpdesk: "/helpdesk",
  vendor: "/vendor",
  client: "/client"
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  
  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = await createSupabaseServerClient();
      
      // Exchange the auth code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth code exchange error:', error);
        // Redirect to auth error page with error details
        const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
        errorUrl.searchParams.set('error', error.message);
        return NextResponse.redirect(errorUrl);
      }
      
      // Log the successful authentication
      console.log('Authentication successful:', session ? 'Session created' : 'No session created');
      
      // If we have a session, determine the correct dashboard based on user role
      if (session) {
        try {
          // Get user's role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('type')
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile?.type) {
            console.error('Error fetching user role:', profileError);
            return NextResponse.redirect(new URL(next, requestUrl.origin));
          }

          // Normalize the user type to lowercase for consistent handling
          const userTypeKey = profile.type.toLowerCase();
          console.log('User role for redirection:', userTypeKey);
          
          // Get the appropriate home route for this user type, fallback to next param
          const homeRoute = USER_HOME_ROUTES[userTypeKey] || next;
          console.log('Redirecting to user dashboard:', homeRoute);
          
          // Redirect to the appropriate dashboard
          return NextResponse.redirect(new URL(homeRoute, requestUrl.origin));
        } catch (profileError) {
          console.error('Error in profile lookup:', profileError);
          // Fall back to the provided 'next' parameter
          return NextResponse.redirect(new URL(next, requestUrl.origin));
        }
      }
      
      // Successful auth but no session - redirect to home or requested page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error) {
      console.error('Auth callback error:', error);
      // Redirect to auth error page
      const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
      if (error instanceof Error) {
        errorUrl.searchParams.set('error', error.message);
      }
      return NextResponse.redirect(errorUrl);
    }
  }
  
  // If no code is present, redirect to error page
  return NextResponse.redirect(new URL('/auth/auth-code-error?error=no_code', requestUrl.origin));
}