// utils/supabase/auth-helpers.ts

/**
 * Gets the appropriate redirect URL based on the current environment
 * Works in both client and server contexts
 */
export function getRedirectUrl(): string {
    // For client-side
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/callback`;
    }
    
    // For server-side
    // First check for Vercel-specific environment variables
    if (process.env.VERCEL_URL) {
      // Vercel provides this for all deployments including previews
      return `https://${process.env.VERCEL_URL}/auth/callback`;
    }
    
    // Fall back to the configured site URL or localhost
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${baseUrl}/auth/callback`;
  }
  
  /**
   * Function to handle OAuth sign-in with dynamic redirect
   */
  export async function signInWithOAuth(
    supabase: any, 
    provider: 'google' | 'github' | 'facebook' | 'azure' | 'twitter',
    options: any = {}
  ) {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        ...options,
        redirectTo: getRedirectUrl()
      }
    });
  }