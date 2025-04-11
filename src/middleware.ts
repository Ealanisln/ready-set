// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/utils/supabase/middleware";

// Constants and Types
const USER_TYPES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  DRIVER: "driver",
  HELPDESK: "helpdesk",
  VENDOR: "vendor",
  CLIENT: "client",
} as const;

type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

type TypeRoutes = {
  readonly [K in UserType]: string;
};

interface CustomToken {
  type?: UserType;
  isTemporaryPassword?: boolean;
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

// Define explicitly which paths require admin privileges
const ADMIN_PATHS: ReadonlySet<string> = new Set(["/admin"]); // User-facing admin path

export async function middleware(request: NextRequest) {
  console.log("Middleware V2 called for:", request.nextUrl.pathname);

  // Skip middleware for specific paths
  if (request.nextUrl.pathname === "/complete-profile") {
    console.log("Middleware V2: Skipping /complete-profile");
    return NextResponse.next();
  }

  // 1. Run updateSession first to handle cookie synchronization
  console.log("Middleware V2: Calling updateSession...");
  const supabaseResponse = await updateSession(request);
  console.log("Middleware V2: updateSession finished.");

  // 2. Create a client using the *updated* cookies from the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Read cookies from the response potentially modified by updateSession
          return supabaseResponse.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // This shouldn't strictly be needed here if updateSession handles it,
          // but keeping it ensures cookie consistency if logic changes.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Re-fetch the user to ensure we have the latest validated session state
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Middleware V2 - User after updateSession:", user?.id);

  const pathname = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;

  // --- Authentication Check ---
  if (!user) {
    // Redirect to sign-in only if accessing a protected admin path
    if (ADMIN_PATHS.has(pathname) || pathname.startsWith("/admin/")) {
       console.log("Middleware V2: Unauthenticated user trying to access admin path, redirecting to sign-in");
       const url = new URL("/sign-in", origin);
       // Ensure cookies from updateSession are carried over in redirect
       const redirectResponse = NextResponse.redirect(url);
       supabaseResponse.cookies.getAll().forEach(cookie => {
           redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
       });
       return redirectResponse;
    }
    // Allow access to non-admin paths for unauthenticated users
    console.log("Middleware V2: Unauthenticated user accessing non-admin path, allowing.");
    return supabaseResponse; // Allow access, returning the response from updateSession
  }

  // --- Role Fetching (Authenticated Users) ---
  let userRole: UserType | null = null;
  try {
    console.log("Middleware V2: Fetching user role from profiles...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", user.id) // Use ID directly as per this logic
      .single();

    if (profileError) {
       // Log error only if it's not 'PGRST116' (row not found)
       if (profileError.code !== 'PGRST116') {
          console.error("Middleware V2: Error fetching profile:", profileError);
       } else {
          console.log("Middleware V2: Profile not found for user:", user.id);
       }
    }

    const fetchedUserType = profile?.type?.toLowerCase();
    if (profile && fetchedUserType && Object.values(USER_TYPES).includes(fetchedUserType as UserType)) {
      userRole = profile.type as UserType;
      console.log("Middleware V2: Found role in profiles table:", userRole);
    } else {
      console.log(`Middleware V2: No valid role in profiles. Fetched type: ${profile?.type}`);
    }
  } catch (error) {
    console.error("Middleware V2: Catch block error fetching user role:", error);
  }

  const lowerCaseUserRole = userRole?.toLowerCase() as keyof typeof TYPE_ROUTES | undefined;

  // --- Root Path Redirect (Authenticated Users with Role) ---
  if (pathname === "/" && lowerCaseUserRole && lowerCaseUserRole in TYPE_ROUTES) {
    console.log(`Middleware V2: Redirecting ${userRole} from / to ${TYPE_ROUTES[lowerCaseUserRole]}`);
    const redirectUrl = new URL(TYPE_ROUTES[lowerCaseUserRole], origin);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Apply cookies from supabaseResponse to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // --- Admin Path Handling (Rewrite & Authorization) ---
  if (pathname.startsWith("/admin")) {
      // First check if user is authenticated at all
      if (!user) {
          console.log("Middleware V2: Unauthenticated user trying to access admin path");
          const signInUrl = new URL("/sign-in", origin);
          signInUrl.searchParams.set("returnTo", pathname);
          const redirectResponse = NextResponse.redirect(signInUrl);
          supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
          });
          return redirectResponse;
      }

      // Then check if user has admin privileges (case-insensitive)
      if (!lowerCaseUserRole || !["admin", "super_admin"].includes(lowerCaseUserRole)) {
          console.log(`Middleware V2: Non-admin user (${userRole}) trying to access ${pathname}, redirecting.`);
          // Redirect non-admins away from /admin/* paths
          const redirectPath = (lowerCaseUserRole && lowerCaseUserRole in TYPE_ROUTES) ? TYPE_ROUTES[lowerCaseUserRole] : "/";
          const redirectUrl = new URL(redirectPath, origin);
          // Re-apply cookies
          const redirectResponse = NextResponse.redirect(redirectUrl);
          supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
          });
          return redirectResponse;
      }

      // User is authenticated and has admin role, allow access to /admin/*
      // Next.js routing will handle mapping to /(backend)/admin/*
      console.log(`Middleware V2: Admin user accessing ${pathname}, allowing request.`);
      return supabaseResponse; // Allow request with cookies from updateSession
  }

  // --- Prevent direct access to (backend) routes ---
  // Optional: Add this if you want to explicitly block users from typing /(backend)/admin in the URL
  if (pathname.startsWith("/(backend)")) {
       console.log(`Middleware V2: Blocking direct access attempt to ${pathname}`);
       const url = new URL("/", origin); // Redirect to home or a 404 page
       const redirectResponse = NextResponse.redirect(url);
       supabaseResponse.cookies.getAll().forEach((cookie) => {
         redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
       });
       return redirectResponse;
  }

  // Default: Allow request to proceed (for non-admin paths or already handled cases)
  console.log(`Middleware V2: Allowing request for ${pathname} to proceed.`);
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - fonts (public fonts)
     * - complete-profile (public page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|complete-profile).*)',
    // Explicitly include paths we want middleware to handle if needed beyond the general pattern
    "/",
    "/admin/:path*", // Needs to match the user-facing path for rewrite/auth checks
    // We don't necessarily need to match /(backend)/admin/:path* if we block direct access
  ],
};