import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const baseUrl = new URL(request.url).origin;

    // If no token, redirect to signin except for public routes
    if (!token && !request.nextUrl.pathname.startsWith('/signin')) {
      return NextResponse.redirect(new URL('/signin', baseUrl));
    }

    // Check if user has a temporary password first
    if (token?.isTemporaryPassword === true) {
      if (request.nextUrl.pathname === '/change-password') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/change-password', baseUrl));
    }

    const hasAllowedRole = (allowedRoles: string[]) => 
      token?.type && allowedRoles.includes(token.type as string);

    // Handle landing page redirect for authenticated users
    if (request.nextUrl.pathname === '/') {
      if (token) {
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
      return NextResponse.next();
    }

    // Admin routes protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!hasAllowedRole(['admin', 'super_admin'])) {
        return NextResponse.redirect(new URL('/signin', baseUrl));
      }
      return NextResponse.next();
    }

    // Protected addresses routes
    if (request.nextUrl.pathname.startsWith('/addresses')) {
      if (!token) {
        return NextResponse.redirect(new URL('/signin', baseUrl));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = { 
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*',
    '/super-admin/:path*',
    '/addresses/:path*'
  ]
};