import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Constants and Types
const USER_TYPES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  DRIVER: 'driver',
  HELPDESK: 'helpdesk',
  VENDOR: 'vendor',
  CLIENT: 'client'
} as const;

type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

type TypeRoutes = {
  readonly [K in UserType]: string;
};

interface CustomToken {
  type?: UserType;
  isTemporaryPassword?: boolean;
}

// Constants
const TYPE_ROUTES: TypeRoutes = {
  admin: '/admin',
  super_admin: '/admin',
  driver: '/driver',
  helpdesk: '/helpdesk',
  vendor: '/vendor',
  client: '/client'
} as const;

const PROTECTED_PATHS: ReadonlySet<string> = new Set(['/admin', '/addresses']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const baseUrl = new URL(request.url).origin;

  // Early return for public assets and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  try {
    // Check if path needs protection
    const isProtectedPath = Array.from(PROTECTED_PATHS).some((path: string) => 
      pathname.startsWith(path)
    );

    const token = isProtectedPath ? 
      await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      }) as CustomToken | null 
      : null;

    // Handle non-authenticated users for protected routes
    if (isProtectedPath && !token) {
      return NextResponse.redirect(new URL('/signin', baseUrl));
    }

    // Skip further checks if no token
    if (!token) return NextResponse.next();

    // Handle temporary password
    if (token.isTemporaryPassword === true) {
      return pathname === '/change-password' 
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/change-password', baseUrl));
    }

    // Handle landing page redirect
    if (pathname === '/' && token.type && token.type in TYPE_ROUTES) {
      const redirectPath = TYPE_ROUTES[token.type];
      return NextResponse.redirect(new URL(redirectPath, baseUrl));
    }

    // Handle admin routes
    if (pathname.startsWith('/admin')) {
      const isAdmin = token.type === USER_TYPES.ADMIN || token.type === USER_TYPES.SUPER_ADMIN;
      if (!isAdmin) {
        const fallbackPath = token.type ? TYPE_ROUTES[token.type] : '/';
        return NextResponse.redirect(new URL(fallbackPath, baseUrl));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Remove the 'as const' assertion
export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/addresses/:path*',
    '/change-password',
    '/signin'
  ]
};