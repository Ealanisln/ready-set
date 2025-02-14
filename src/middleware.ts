// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Type definitions
type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

interface CustomToken {
  type?: UserType;
  isTemporaryPassword?: boolean;
}

// Constants
const USER_TYPES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  DRIVER: 'driver',
  HELPDESK: 'helpdesk',
  VENDOR: 'vendor',
  CLIENT: 'client'
} as const;

const TYPE_ROUTES: Record<UserType, string> = {
  [USER_TYPES.ADMIN]: '/admin',
  [USER_TYPES.SUPER_ADMIN]: '/admin',
  [USER_TYPES.DRIVER]: '/driver',
  [USER_TYPES.HELPDESK]: '/helpdesk',
  [USER_TYPES.VENDOR]: '/vendor',
  [USER_TYPES.CLIENT]: '/client'
};

const PROTECTED_ROUTES = ['/admin', '/addresses'];

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    }) as CustomToken | null;
    
    const { pathname } = request.nextUrl;
    const baseUrl = new URL(request.url).origin;

    // Handle non-authenticated users
    if (!token) {
      if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/signin', baseUrl));
      }
      return NextResponse.next();
    }

    // Handle temporary password
    if (token.isTemporaryPassword === true) {
      if (pathname === '/change-password') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/change-password', baseUrl));
    }

    // Handle landing page redirect for authenticated users
    if (pathname === '/') {
      if (token.type && token.type in TYPE_ROUTES) {
        return NextResponse.redirect(new URL(TYPE_ROUTES[token.type], baseUrl));
      }
    }

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      const allowedRoles: UserType[] = [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN];
      const hasAllowedRole = token.type && allowedRoles.includes(token.type);
      
      
      if (!hasAllowedRole) {
        const redirectPath = token.type ? TYPE_ROUTES[token.type] : '/';
        return NextResponse.redirect(new URL(redirectPath, baseUrl));
      }
    }

    // Allow access to all other routes
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/admin/:path*',
    '/addresses/:path*'
  ]
};