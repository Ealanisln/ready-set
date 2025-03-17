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

    // Check permissions - only return files the user has access to
    // You might want to implement additional authorization logic here
    // based on the relationship between the user and the entity
    const { data: entityOwner, error: entityError } = await supabase
      .from(entityType === 'catering_request' ? 'catering_request' : 'on_demand')
      .select('user_id')
      .eq('id', entityId)
      .single();

    const isAdmin = await checkIfUserIsAdmin(supabase, session.user.id);
    
    if (entityError && !isAdmin) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Entity not found' },
        { status: 404 }
      );
    }

    // If the user is not an admin and not the owner of the entity,
    // check if they have permission to access it
    if (!isAdmin && entityOwner && entityOwner.user_id !== session.user.id) {
      // You can implement more complex permission logic here
      // For now, we'll allow access if the user is associated with the entity
      // e.g., as a driver for a delivery
      const { data: association, error: associationError } = await supabase
        .from('dispatch')
        .select('*')
        .or(`cateringRequestId.eq.${entityId},on_demandId.eq.${entityId}`)
        .eq('driverId', session.user.id)
        .single();

      if (associationError && !association) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'You do not have permission to access these files' },
          { status: 403 }
        );
      }
    }

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

// Helper function to check if a user is an admin
async function checkIfUserIsAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('type')
    .eq('auth_user_id', userId)
    .single();

  if (error || !profile) return false;
  
  return profile.type === 'admin' || profile.type === 'super_admin' || profile.type === 'helpdesk';
}