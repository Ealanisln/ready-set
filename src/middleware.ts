import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (token && token.type === "admin") {
      return NextResponse.next();
    } else {
      // Redirect to login page or unauthorized page
      return NextResponse.redirect(new URL("/signin", request.url));
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
  matcher: ["/admin/:path*", "/addresses/:path*"]
};