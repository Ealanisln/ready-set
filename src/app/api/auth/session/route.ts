// src/app/api/auth/session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Use await with createClient since your implementation returns a Promise
    const supabase = await createClient();
    
    // Get the current authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Return the user data
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

// This is needed to prevent the middleware from redirecting API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};