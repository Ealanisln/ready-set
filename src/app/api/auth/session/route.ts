// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { user: null },
        { status: 200 } // Return 200 even for no user
      );
    }
    
    // Return the user data
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { user: null, error: 'Authentication error' },
      { status: 200 } // Still return 200 for client-side handling
    );
  }
}