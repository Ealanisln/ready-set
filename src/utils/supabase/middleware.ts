// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname);
  
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  console.log('Middleware - User authenticated:', user?.id);

  // Get user role if user exists
  let userRole = null
  if (user) {
    // Try looking in 'profiles' table with auth_user_id
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('type')
      .eq('auth_user_id', user.id)
      .single()
    
    if (error || !profile) {
      console.log('First attempt failed, trying "profiles" with "id"');
      // Try looking in 'profiles' table with id
      const result = await supabase
        .from('profiles')
        .select('type')
        .eq('id', user.id)
        .single()
      
      profile = result.data;
      error = result.error;
    }
    
    if (error || !profile) {
      console.log('Second attempt failed, trying "users" table in "auth" schema');
      // Try looking directly in auth.users table for role
      const result = await supabase
        .from('auth.users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (result.data) {
        userRole = result.data.role;
      }
    } else {
      userRole = profile.type;
    }
    
    console.log('Final user role:', userRole);
  }

  // Rest of your middleware remains the same
  // ...
  
  return supabaseResponse
}