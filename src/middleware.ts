import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Helper function to check if the user has one of the allowed roles
  const hasAllowedRole = (allowedRoles: string[]) => 
    token && allowedRoles.includes(token.type as string);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (hasAllowedRole(["admin", "super_admin"])) {
      return NextResponse.next();
    } else {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/super-admin")) {
    if (hasAllowedRole(["super_admin"])) {
      return NextResponse.next();
    } else {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/addresses")) {
    if (token) {
      return NextResponse.next();
    } else {
      // Redirect to login page
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // For all other routes, allow access
  return NextResponse.next();
}

export const config = { 
  matcher: ["/admin/:path*", "/super-admin/:path*", "/addresses/:path*"]
};