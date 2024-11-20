import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const baseUrl = new URL(request.url).origin;

    // Handle landing page redirect for authenticated users
    if (request.nextUrl.pathname === '/') {
      if (token) {
        const typeRoutes = {
          admin: '/admin',
          super_admin: '/admin',
          driver: '/driver',
          helpdesk: '/helpdesk',
          vendor: '/vendor',
          client: '/client'
        };
        const redirectPath = typeRoutes[token.type as keyof typeof typeRoutes];
        if (redirectPath) {
          return NextResponse.redirect(new URL(redirectPath, baseUrl));
        }
      }
    }

    // Check if user has a temporary password
    if (token?.isTemporaryPassword === true) {
      if (request.nextUrl.pathname === '/change-password') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/change-password', baseUrl));
    }

    const hasAllowedRole = (allowedRoles: string[]) => 
      token?.type && allowedRoles.includes(token.type as string);

    // Admin routes protection
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return hasAllowedRole(["admin", "super_admin"])
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/signin", baseUrl));
    }

    // Super admin routes protection
    if (request.nextUrl.pathname.startsWith("/super-admin")) {
      return hasAllowedRole(["super_admin"])
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/signin", baseUrl));
    }

    // Protected addresses routes
    if (request.nextUrl.pathname.startsWith("/addresses")) {
      return token
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/signin", baseUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = { 
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    "/admin/:path*",
    "/super-admin/:path*",
    "/addresses/:path*"
  ]
};