import { NextResponse } from 'next/server';

// Import with a different name to avoid conflicts
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
      
      // If we have a session, determine the correct dashboard based on user role
      if (data.session) {
        try {
          // Get user's role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('type')
            .eq('id', data.session.user.id)
            .single();

          if (profileError || !profile?.type) {
            console.error('Error fetching user role:', profileError);
            return NextResponse.redirect(new URL('/', requestUrl.origin));
          }

          // Normalize the user type to lowercase for consistent handling
          const userTypeKey = profile.type.toLowerCase();
          console.log('User role for redirection:', userTypeKey);
          
          // Get the appropriate home route for this user type
          const homeRoute = USER_HOME_ROUTES[userTypeKey] || '/';
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
      return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
    }
  }
  
  // If no code is present, redirect to error page
  return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
}