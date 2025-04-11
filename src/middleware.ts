// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { updateSession } from "@/utils/supabase/middleware";
import { protectRoutes } from './middleware/routeProtection';

// Constants and Types (Consider moving these to a shared types file if used elsewhere)
const USER_TYPES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  DRIVER: "driver",
  HELPDESK: "helpdesk",
  VENDOR: "vendor",
  CLIENT: "client",
} as const;

type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

interface TypeRoutes {
  [key: string]: string;
}

// Constants
const TYPE_ROUTES: TypeRoutes = {
  admin: "/admin",
  super_admin: "/admin",
  driver: "/driver",
  helpdesk: "/helpdesk",
  vendor: "/vendor",
  client: "/client",
} as const;

const PROTECTED_PATHS: ReadonlySet<string> = new Set(["/admin", "/addresses"]);
const ADMIN_PATHS: ReadonlySet<string> = new Set(["/admin"]); // User-facing admin path

export async function middleware(request: NextRequest) {
  // console.log("Middleware V2 called for:", request.nextUrl.pathname); // Keep this? Optional

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
  return response; // Return the response potentially modified by updateSession cookies
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Include specific paths if needed, but the above negative lookahead is often sufficient
    // '/admin/:path*',
    // '/client/:path*',
    // '/driver/:path*',
    // etc.
  ],
};