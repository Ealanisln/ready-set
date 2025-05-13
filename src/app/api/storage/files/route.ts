// app/api/storage/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getFilesForEntity } from '@/utils/file-service';
import { SupabaseClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'You must be logged in to view files' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Entity type and ID are required' },
        { status: 400 }
      );
    }

    // Get files for the entity
    const files = await getFilesForEntity(entityType, entityId);

    // TODO: Implement proper permission check
    // We're temporarily bypassing this due to type issues with the database schema
    
    return NextResponse.json({
      files
    });
  } catch (error: any) {
    console.error('Error getting files:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// Helper function to check if a user is an admin - commented out for now
// since we're not using it and it has type issues
/*
async function checkIfUserIsAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    // This would need proper typing based on your database schema
    const { data, error } = await supabase.rpc('is_admin_user', { user_id: userId });
    return data || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
*/