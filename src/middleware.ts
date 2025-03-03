// src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname)
  
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
  
  console.log('Middleware - User authenticated:', user?.id)

  // Get user role if user exists
  let userRole = null
  if (user) {
    try {
      // First check profiles table - it looks like in your schema this is likely where the type/role is stored
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('type')
        .eq('auth_user_id', user.id)
        .single()
      
      if (profile) {
        userRole = profile.type
        console.log('Found role in profiles table:', userRole)
      } else {
        console.log('Profile not found, error:', error)
        
        // Try to get user metadata from auth, which might contain role info
        const { data: userData } = await supabase.auth.admin.getUserById(user.id)
        if (userData?.user?.user_metadata?.role) {
          userRole = userData.user.user_metadata.role
          console.log('Found role in user metadata:', userRole)
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
    }
  }

  // Handle authentication and role-based routing
  if (!user && 
      !request.nextUrl.pathname.startsWith('/login') && 
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.startsWith('/signin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // For debugging only
  if (user && !userRole) {
    console.log('User authenticated but no role found')
  }

  // Handle role-based routing for authenticated users
  if (user && userRole) {
    const baseUrl = new URL(request.url).origin

    // Handle landing page redirects
    if (request.nextUrl.pathname === '/') {
      const typeRoutes: Record<string, string> = {
        admin: '/admin',
        super_admin: '/admin',
        driver: '/driver',
        helpdesk: '/helpdesk',
        vendor: '/vendor',
        client: '/client'
      }
      
      if (userRole in typeRoutes) {
        console.log(`Redirecting ${userRole} to ${typeRoutes[userRole]}`)
        const redirectUrl = new URL(typeRoutes[userRole], baseUrl)
        const redirectResponse = NextResponse.redirect(redirectUrl)
        supabaseResponse.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
      }
    }

    // Admin routes protection
    if (request.nextUrl.pathname.startsWith('/admin') && 
        !['admin', 'super_admin'].includes(userRole)) {
      const typeRoutes: Record<string, string> = {
        driver: '/driver',
        helpdesk: '/helpdesk',
        vendor: '/vendor',
        client: '/client'
      }
      console.log(`Non-admin user trying to access admin route, redirecting to ${typeRoutes[userRole] || '/'}`)
      const redirectPath = typeRoutes[userRole] || '/'
      const redirectUrl = new URL(redirectPath, baseUrl)
      const redirectResponse = NextResponse.redirect(redirectUrl)
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      return redirectResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/addresses/:path*',
    '/',
  ],
}