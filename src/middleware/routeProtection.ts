import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { UserType } from '@prisma/client';

// Define protected role-specific routes
const PROTECTED_ROUTES: Record<UserType, RegExp> = {
  [UserType.ADMIN]: /^\/admin(\/.*)?$/,
  [UserType.SUPER_ADMIN]: /^\/admin(\/.*)?$/,
  [UserType.DRIVER]: /^\/driver(\/.*)?$/,
  [UserType.HELPDESK]: /^\/helpdesk(\/.*)?$/,
  [UserType.VENDOR]: /^\/vendor(\/.*)?$/,
  [UserType.CLIENT]: /^\/client(\/.*)?$/
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/contact',
  '/about',
  '/apply',
  '/privacy-policy',
  '/terms-of-service'
];

export async function protectRoutes(request: Request) {
  const { pathname } = new URL(request.url);
  
  // Allow access to public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  // Check if the current path is a protected role-specific route
  const isProtectedRoute = Object.values(PROTECTED_ROUTES).some(pattern => pattern.test(pathname));
  
  if (!isProtectedRoute) {
    return null; // Allow access to non-protected routes
  }

  // Create Supabase client
  const supabase = await createClient();
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // If no user is authenticated, redirect to sign-in
  if (!user) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(url);
  }

  // Get user's role from profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('type')
    .eq('id', user.id)
    .single();

  if (error || !profile?.type) {
    console.error('Error fetching user role:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }

  const userType = profile.type as UserType;

  // Check if the current path matches the user's allowed routes
  const isAllowedRoute = PROTECTED_ROUTES[userType].test(pathname);

  // If the route is not allowed for the user's type, redirect to their home page
  if (!isAllowedRoute) {
    const homeRoute = `/${userType.toLowerCase()}`;
    return NextResponse.redirect(new URL(homeRoute, request.url));
  }

  return null;
} 