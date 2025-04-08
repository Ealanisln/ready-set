// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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
  console.log("Middleware called for:", request.nextUrl.pathname);

  // Skip middleware for specific paths
  if (request.nextUrl.pathname === "/complete-profile") {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Middleware - User authenticated:", user?.id);

  const pathname = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;

  // --- Authentication Check ---
  if (!user) {
    // Redirect to sign-in only if accessing a protected admin path
    if (ADMIN_PATHS.has(pathname) || pathname.startsWith("/admin/")) {
       console.log("Unauthenticated user trying to access admin path, redirecting to sign-in");
       const url = new URL("/sign-in", origin);
       return NextResponse.redirect(url);
    }
    // Allow access to non-admin paths for unauthenticated users
    return supabaseResponse;
  }

  // --- Role Fetching (Authenticated Users) ---
  let userRole: UserType | null = null;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", user.id)
      .single();

    // Convert fetched type to lowercase for case-insensitive comparison
    const fetchedUserType = profile?.type?.toLowerCase();

    // Check if profile exists and fetchedUserType is a valid UserType
    if (profile && fetchedUserType && Object.values(USER_TYPES).includes(fetchedUserType as UserType)) {
      userRole = profile.type as UserType; // Assign original case from profile
      console.log("Found role in profiles table:", userRole);
    } else {
      console.log(`No valid user role found in profiles table for authenticated user. Fetched type: ${profile?.type}`);
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }

  const lowerCaseUserRole = userRole?.toLowerCase() as keyof typeof TYPE_ROUTES | undefined;

  // --- Root Path Redirect (Authenticated Users with Role) ---
  if (pathname === "/" && lowerCaseUserRole && lowerCaseUserRole in TYPE_ROUTES) {
    console.log(`Redirecting ${userRole} from / to ${TYPE_ROUTES[lowerCaseUserRole]}`);
    const redirectUrl = new URL(TYPE_ROUTES[lowerCaseUserRole], origin);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // --- Admin Path Handling (Rewrite & Authorization) ---
  if (pathname.startsWith("/admin")) {
      // Check if user has admin privileges (case-insensitive)
      if (!lowerCaseUserRole || !["admin", "super_admin"].includes(lowerCaseUserRole)) {
          console.log(`Non-admin user (${userRole}) trying to access ${pathname}, redirecting.`);
          // Redirect non-admins away from /admin/* paths
          const redirectPath = (lowerCaseUserRole && lowerCaseUserRole in TYPE_ROUTES) ? TYPE_ROUTES[lowerCaseUserRole] : "/";
          const redirectUrl = new URL(redirectPath, origin);
           // Re-apply cookies
          const redirectResponse = NextResponse.redirect(redirectUrl);
          supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value);
          });
          return redirectResponse;
      }

      // User is authenticated and has admin role, allow access to /admin/*
      // Next.js routing will handle mapping to /(backend)/admin/*
      console.log(`Admin user accessing ${pathname}, allowing request to proceed.`);
      return supabaseResponse; // Allow request to proceed with original path & cookies
  }

  // --- Prevent direct access to (backend) routes ---
  // Optional: Add this if you want to explicitly block users from typing /(backend)/admin in the URL
  if (pathname.startsWith("/(backend)")) {
       console.log(`Blocking direct access attempt to ${pathname}`);
       const url = new URL("/", origin); // Redirect to home or a 404 page
       return NextResponse.redirect(url);
  }


  // Default: Allow request to proceed (for non-admin paths or already handled cases)
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