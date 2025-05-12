// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { protectRoutes } from './middleware/routeProtection';
import { highlightMiddleware } from '@highlight-run/next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface TypeRoutes {
  [key: string]: string;
}

// Protected admin routes that require authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/admin/catering-orders',
  '/admin/users',
  '/admin/settings',
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

  // Skip middleware for auth callback routes
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  // Apply route protection (handles unauthenticated access to protected routes)
  const protectionResponse = await protectRoutes(request);
  if (protectionResponse) {
    return protectionResponse;
  }

  // Skip middleware for specific paths like profile completion
  if (request.nextUrl.pathname === "/complete-profile") {
    // console.log("Middleware V2: Skipping /complete-profile"); // Removed
    return NextResponse.next();
  }

  // 1. Run updateSession to handle cookie synchronization and basic auth checks
  // console.log("Middleware V2: Calling updateSession..."); // Removed
  const supabaseResponse = await updateSession(request);
  // console.log("Middleware V2: updateSession finished."); // Removed

  // 2. Create a new response to potentially modify with updated cookies
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 3. Copy all cookies from supabaseResponse to our new response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    const { name, value, ...options } = cookie;
    response.cookies.set(name, value.toString(), options);
  });

  // Note: Further checks (like role-based access beyond what protectRoutes handles) 
  // were previously here but were removed as they were redundant or better placed 
  // within protectRoutes or updateSession.

  // console.log(`Middleware V2: Allowing request for ${request.nextUrl.pathname} to proceed.`); // Removed

  try {
    const supabase = createMiddlewareClient<Database>({ req: request, res: response });
    
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Check if the route requires authentication
    const requiresAuth = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
    
    if (requiresAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Log auth redirect by adding a custom header that will be read by the client
        const response = NextResponse.redirect(new URL(`/sign-in?returnTo=${pathname}`, request.url));
        
        // Add a header to track the redirect (will be used by the client to report to Highlight)
        response.headers.set('x-auth-redirect', 'true');
        response.headers.set('x-redirect-from', pathname);
        response.headers.set('x-redirect-reason', 'unauthenticated');
        
        return response;
      }
      
      // Check for specific admin-only routes
      if (pathname.startsWith('/admin')) {
        // Fetch user profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', session.user.id)
          .single();
        
        if (!profile || !['admin', 'super_admin', 'helpdesk'].includes((profile.type ?? '').toLowerCase())) {
          // User is authenticated but not authorized
          const response = NextResponse.redirect(new URL('/', request.url));
          
          // Add headers for tracking
          response.headers.set('x-auth-redirect', 'true');
          response.headers.set('x-redirect-from', pathname);
          response.headers.set('x-redirect-reason', 'unauthorized');
          
          return response;
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // In case of error, still allow the request through
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