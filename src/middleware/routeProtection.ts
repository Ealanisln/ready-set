import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Define protected role-specific routes
const PROTECTED_ROUTES: Record<string, RegExp> = {
  admin: /^\/admin(\/.*)?$/,
  super_admin: /^\/admin(\/.*)?$/,
  driver: /^\/driver(\/.*)?$/,
  helpdesk: /^\/admin(\/.*)?$/,
  vendor: /^\/vendor(\/.*)?$/,
  client: /^\/client(\/.*)?$/
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
  
  // Add debug logging
  console.log('Current pathname:', pathname);
  
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

  // Add debug logging
  console.log('User profile type from DB:', profile.type);
  
  // Convert the user type to lowercase to match our route keys
  const userTypeKey = profile.type.toLowerCase();
  
  // Add debug logging
  console.log('Normalized user type key for routing:', userTypeKey);
  console.log('Available route keys:', Object.keys(PROTECTED_ROUTES));

  // Check if the userType exists as a key in PROTECTED_ROUTES
  if (!PROTECTED_ROUTES[userTypeKey]) {
    console.error(`Invalid or unexpected user type '${profile.type}' found for user ${user.id}. Redirecting to home.`);
    return NextResponse.redirect(new URL('/', request.url)); 
  }

  // Check if the current path matches the user's allowed routes
  const isAllowedRoute = PROTECTED_ROUTES[userTypeKey].test(pathname);
  
  // Add debug logging
  console.log('Is allowed route:', isAllowedRoute);

  // If the route is not allowed for the user's type, redirect to their home page
  if (!isAllowedRoute) {
    // For helpdesk users, redirect to admin instead of /helpdesk
    const homeRoute = userTypeKey === 'helpdesk' ? '/admin' : `/${userTypeKey}`;
    return NextResponse.redirect(new URL(homeRoute, request.url));
  }

  return null;
}