// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    // Log the incoming request for debugging
    console.log('Auth callback received with URL:', request.url);
    console.log('Code param exists:', !!code);
    console.log('Next param:', next);

    if (!code) {
      console.log('No code found, redirecting to auth error page');
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const supabase = await createClient();
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
    }
    
    if (!data?.user) {
      console.error('No user returned after code exchange');
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No user data returned`);
    }
    
    // Successfully authenticated
    const userId = data.user.id;
    console.log('Authentication successful for user:', userId);
    
    // Check if user already has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching profile:', profileError);
    }
    
    console.log('Profile exists:', !!profile);
    
    // Determine where to redirect
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    
    // If no profile exists, redirect to complete-profile
    // Otherwise redirect to the requested next path
    const redirectPath = !profile ? '/complete-profile' : next;
    
    let redirectUrl;
    if (isLocalEnv) {
      redirectUrl = `${origin}${redirectPath}`;
    } else if (forwardedHost) {
      redirectUrl = `https://${forwardedHost}${redirectPath}`;
    } else {
      redirectUrl = `${origin}${redirectPath}`;
    }
    
    console.log('Redirecting to:', redirectUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=Unexpected error`);
  }
}