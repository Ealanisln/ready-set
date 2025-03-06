// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Successfully authenticated
      const userId = data.user.id;
      
      // Check if user already has a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .single();
      
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
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If there's an error or no valid code, redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}