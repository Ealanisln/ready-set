import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/admin', '/addresses'];

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const baseUrl = new URL(request.url).origin;

    // First check if route needs protection before getting token
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    );

    // Only get token if necessary
    if (isProtectedRoute) {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      if (!token) {
        return NextResponse.redirect(new URL('/signin', baseUrl));
      }

      // Handle temporary password
      if (token.isTemporaryPassword === true) {
        if (pathname === '/change-password') {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/change-password', baseUrl));
      }

      // Admin routes protection
      if (pathname.startsWith('/admin')) {
        const hasAllowedRole = token.type && 
          ['admin', 'super_admin'].includes(token.type as string);
        
        if (!hasAllowedRole) {
          const typeRoutes: Record<string, string> = {
            driver: '/driver',
            helpdesk: '/helpdesk',
            vendor: '/vendor',
            client: '/client'
          };
          const redirectPath = typeRoutes[token.type as string] || '/';
          return NextResponse.redirect(new URL(redirectPath, baseUrl));
        }
      }
    }

    // Handle landing page redirect for authenticated users
    if (pathname === '/') {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      // Only redirect if token exists
      if (token?.type) {
        const typeRoutes: Record<string, string> = {
          driver: '/driver',
          helpdesk: '/helpdesk',
          vendor: '/vendor',
          client: '/client',
          admin: '/admin',
          super_admin: '/admin'
        };
        if (token.type in typeRoutes) {
          return NextResponse.redirect(new URL(typeRoutes[token.type], baseUrl));
        }
      }
      
      return NextResponse.next(); // Allow public access to homepage
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/addresses/:path*',
    '/' // Only include root for homepage redirects
  ]
};