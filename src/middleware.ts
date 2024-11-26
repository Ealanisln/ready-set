import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const baseUrl = new URL(request.url).origin;

    // Let public routes pass through
    if (!token) {
      // Only protect specific routes that require authentication
      if (
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/addresses')
      ) {
        return NextResponse.redirect(new URL('/signin', baseUrl));
      }
      return NextResponse.next();
    }

    // Handle temporary password redirect
    if (token.isTemporaryPassword === true) {
      if (request.nextUrl.pathname === '/change-password') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/change-password', baseUrl));
    }

    const hasAllowedRole = (allowedRoles: string[]) => 
      token.type && allowedRoles.includes(token.type as string);

    // Handle landing page redirect for authenticated users
    if (request.nextUrl.pathname === '/') {
      const typeRoutes: Record<string, string> = {
        admin: '/admin',
        super_admin: '/admin',
        driver: '/driver',
        helpdesk: '/helpdesk',
        vendor: '/vendor',
        client: '/client'
      };
      
      const userType = token.type as string;
      if (userType in typeRoutes) {
        return NextResponse.redirect(new URL(typeRoutes[userType], baseUrl));
      }
    }

    // Admin routes protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!hasAllowedRole(['admin', 'super_admin'])) {
        // Redirect non-admin users to their respective dashboards
        const typeRoutes: Record<string, string> = {
          driver: '/driver',
          helpdesk: '/helpdesk',
          vendor: '/vendor',
          client: '/client'
        };
        const userType = token.type as string;
        const redirectPath = typeRoutes[userType] || '/';
        return NextResponse.redirect(new URL(redirectPath, baseUrl));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = { 
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/admin/:path*',
    '/addresses/:path*'
  ]
};