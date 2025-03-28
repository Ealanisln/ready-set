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

export async function middleware(request: NextRequest) {
  console.log("Middleware called for:", request.nextUrl.pathname);

  // Skip middleware for complete-profile path to avoid redirect loops
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

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Middleware - User authenticated:", user?.id);

  // No user means not authenticated
  if (!user) {
    // Only redirect to sign-in for protected routes (admin and addresses)
    if (
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/addresses")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
    // For other routes (including root), allow access
    return supabaseResponse;
  }

 // Modified role check in middleware
let userRole = null;
if (user) {
  try {
    // First check user table
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("type")
      .eq("id", user.id)
      .single();

    if (userData) {
      userRole = userData.type;
      console.log("Found role in user table:", userRole);
    } else {
      // Fallback to profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("type")
        .eq("auth_user_id", user.id)
        .single();

      if (profile) {
        userRole = profile.type;
        console.log("Found role in profiles table:", userRole);
      } else {
        console.log("No user role found in any table");
      }
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
}

  // For debugging only
  if (user && !userRole) {
    console.log("User authenticated but no role found");
  }

  // Handle role-based routing for authenticated users
  if (user && userRole) {
    const baseUrl = new URL(request.url).origin;

    // Handle landing page redirects - ONLY FOR THE ROOT PATH
    if (request.nextUrl.pathname === "/") {
      const typeRoutes: Record<string, string> = {
        admin: "/admin",
        super_admin: "/admin",
        driver: "/driver",
        helpdesk: "/helpdesk",
        vendor: "/vendor",
        client: "/client",
      };

      if (userRole in typeRoutes) {
        console.log(`Redirecting ${userRole} to ${typeRoutes[userRole]}`);
        const redirectUrl = new URL(typeRoutes[userRole], baseUrl);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value);
        });
        return redirectResponse;
      }
    }

    // Admin routes protection
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      !["admin", "super_admin"].includes(userRole)
    ) {
      const typeRoutes: Record<string, string> = {
        driver: "/driver",
        helpdesk: "/helpdesk",
        vendor: "/vendor",
        client: "/client",
      };
      console.log(
        `Non-admin user trying to access admin route, redirecting to ${typeRoutes[userRole] || "/"}`,
      );
      const redirectPath = typeRoutes[userRole] || "/";
      const redirectUrl = new URL(redirectPath, baseUrl);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/addresses/:path*",
    "/vendor/:path*",
    "/client/:path*",
    "/driver/:path*",
    "/helpdesk/:path*",
    // Exclude user profile routes from redirection
    "/((?!user|api|_next/static|_next/image|favicon.ico).*)",
  ],
};