// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { highlightMiddleware } from '@highlight-run/next/server';

// Protected admin routes that require authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/admin/catering-orders',
  '/admin/users',
  '/admin/job-applications',
  '/dashboard'
];

export async function middleware(request: NextRequest) {
  // Apply Highlight.run middleware for cookie-based session tracking
  try {
    await highlightMiddleware(request);
  } catch (error) {
    console.error('Highlight middleware error:', error);
    // Continue processing the request even if highlight has an error
  }

  // Skip middleware for specific paths
  if (request.nextUrl.pathname.startsWith('/auth/callback') ||
      request.nextUrl.pathname === "/complete-profile") {
    return NextResponse.next();
  }

  try {
    // Update the user's session using Supabase middleware helper
    const response = await updateSession(request);
    
    // Check if the path is a protected route
    const { pathname } = request.nextUrl;
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    // Only check auth for protected routes
    if (isProtectedRoute) {
      try {
        // Create Supabase client from the middleware response
        const { createClient } = await import('@/utils/supabase/server');
        const supabase = await createClient();

        // Get the current user
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!user || error) {
          // User is not authenticated, redirect to sign-in
          const redirectUrl = new URL(`/sign-in?returnTo=${pathname}`, request.url);
          const response = NextResponse.redirect(redirectUrl);
          
          // Add tracking headers
          response.headers.set('x-auth-redirect', 'true');
          response.headers.set('x-redirect-from', pathname);
          response.headers.set('x-redirect-reason', 'unauthenticated');
          
          return response;
        }

        // Check for admin-only routes
        if (pathname.startsWith('/admin')) {
          // Get user profile to check role
          const { data: profile } = await supabase
            .from('profiles')
            .select('type')
            .eq('id', user.id)
            .single();
          
          if (!profile || !['admin', 'super_admin', 'helpdesk'].includes((profile.type ?? '').toLowerCase())) {
            // User is authenticated but not authorized
            const response = NextResponse.redirect(new URL('/', request.url));
            
            // Add tracking headers
            response.headers.set('x-auth-redirect', 'true');
            response.headers.set('x-redirect-from', pathname);
            response.headers.set('x-redirect-reason', 'unauthorized');
            
            return response;
          }
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        // On error, redirect to sign-in as a safety measure
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};