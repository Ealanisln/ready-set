import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if user has a temporary password
  if (token && token.isTemporaryPassword) {
    const changePasswordURL = new URL('/change-password', request.url);
    if (request.nextUrl.pathname !== '/change-password') {
      return NextResponse.redirect(changePasswordURL);
    }
  }

  // Helper function to check if the user has one of the allowed roles
  const hasAllowedRole = (allowedRoles: string[]) => 
    token && token.type && allowedRoles.includes(token.type as string);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (hasAllowedRole(["admin", "super_admin"])) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/super-admin")) {
    if (hasAllowedRole(["super_admin"])) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/addresses")) {
    if (token) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // For all other routes, allow access
  return NextResponse.next();
}

export const config = { 
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', "/admin/:path*", "/super-admin/:path*", "/addresses/:path*"]
};