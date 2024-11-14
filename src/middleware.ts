import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Create base URL for redirects
    const baseUrl = new URL(request.url).origin;

    // Check if user has a temporary password
    if (token?.isTemporaryPassword === true) {
      // Don't redirect if already on change-password page
      if (request.nextUrl.pathname === '/change-password') {
        return NextResponse.next();
      }
      
      // Safe redirect to change-password
      return NextResponse.redirect(new URL('/change-password', baseUrl));
    }

    // Helper function to check if the user has one of the allowed roles
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

    // For all other routes, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Safely redirect to signin page in case of errors
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