import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Middleware to handle authentication redirects
export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()
    
    // Create Supabase client with cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name, options) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )
    
    // Check if this is a request from admin panel
    const isAdminRequest = request.headers.get('x-admin-mode') === 'true' || 
                           request.headers.get('x-request-source') === 'AdminPanel';
    
    // Check if this is an admin route
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin/') && 
                         /\/admin\/users\/[0-9a-f-]{36}/.test(request.nextUrl.pathname);
    
    // For admin panel requests or admin routes, bypass authentication checks
    if (isAdminRequest || isAdminRoute) {
      console.log('[Middleware] Admin mode detected, bypassing auth check');
      return response;
    }
    
    // For all other requests, perform normal auth refresh
    await supabase.auth.getSession();
    return response;
  } catch (error) {
    console.error('[Middleware] Error:', error);
    return NextResponse.next();
  }
}

// Only apply middleware to relevant routes
export const config = {
  matcher: [
    '/api/users/:path*',
    '/api/file-uploads/:path*',
    '/admin/:path*',
  ],
} 