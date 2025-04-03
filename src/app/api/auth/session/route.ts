// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the full session, not just the user
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return NextResponse.json(
        { user: null, session: null },
        { status: 200 } // Return 200 even for no session
      );
    }
    
    // Return the complete session data structure
    return NextResponse.json({
      user: data.session.user,
      session: data.session
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { user: null, session: null, error: 'Authentication error' },
      { status: 200 } // Still return 200 for client-side handling
    );
  }
}