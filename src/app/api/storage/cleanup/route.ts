// app/api/storage/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cleanupOrphanedFiles } from '@/utils/file-service';

// This endpoint can be used in a cron job or triggered manually
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check for admin privileges
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    // Get user role from the database
    const { data: user, error: userError } = await supabase
      .from('profiles')  // Change this to your user profile table
      .select('type')
      .eq('auth_user_id', session.user.id)
      .single();

    // Check if user is admin
    const isAdmin = user?.type === 'admin' || user?.type === 'super_admin';
    
    if (userError || !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // Extract hours parameter from request (default to 24 hours)
    const { hours } = await request.json().catch(() => ({ hours: 24 }));
    
    // Clean up orphaned files
    const result = await cleanupOrphanedFiles(Number(hours) || 24);

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      ...result
    });
  } catch (error: any) {
    console.error('Error during file cleanup:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// Also allow GET requests for running cleanup via URL (admin only)
export async function GET(request: NextRequest) {
  return POST(request);
}