// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // console.log('Middleware called for:', request.nextUrl.pathname); // Keep this? Optional.
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    // First, try to refresh the session
    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
    
    if (refreshError) {
      // console.error('Session refresh error:', refreshError); // Removed
      return supabaseResponse // Fail gracefully
    }

    // If we have a refreshed session, use it
    if (refreshedSession) {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        // console.error('User error:', userError); // Removed
        return supabaseResponse // Fail gracefully
      }

      // console.log('Middleware - User authenticated:', user?.id); // Removed

      // Get user role if user exists
      let userRole = null
      if (user) {
        // console.log("Middleware V2: Fetching user role from profiles..."); // Removed
        // Try looking in 'profiles' table with id (assuming this is the foreign key)
        let { data: profile, error } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id) // Query by id directly
          .single()
        
        // Removed specific error log for profile fetch failure

        if (error || !profile) {
          // console.log('Middleware V2: Attempt to fetch profile by id failed. Trying "users" table in "auth" schema'); // Removed
          // Try looking directly in auth.users table for role
          const result = await supabase
            .from('auth.users') // Ensure this table and column exist
            .select('role')
            .eq('id', user.id)
            .single()
          
          // Removed specific error log for auth.users fetch failure

          if (result.data) {
            userRole = result.data.role
          } // Removed else with console.log
        } else {
          userRole = profile.type
        }
        
        // console.log('Final user role:', userRole); // Removed
      }
    }

    return supabaseResponse
  } catch (error) {
    // console.error('Error in updateSession:', error); // Removed
    return supabaseResponse // Fail gracefully
  }
}