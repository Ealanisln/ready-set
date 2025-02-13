// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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

  // Get user role if user exists
  let userRole = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role
  }

  // Handle authentication and role-based routing
  if (!user && 
      !request.nextUrl.pathname.startsWith('/login') && 
      !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
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