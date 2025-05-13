// app/api/storage/update-entity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { updateFileEntityId } from '@/utils/file-service';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'You must be logged in to update file associations' },
      { status: 401 }
    );
  }

  try {
    const { oldEntityId, newEntityId } = await request.json();
    
    if (!oldEntityId || !newEntityId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Both oldEntityId and newEntityId are required' },
        { status: 400 }
      );
    }

    // Update file entity IDs
    // Explicitly type the result to handle the type issue
    const updatedFiles = await updateFileEntityId(
      oldEntityId,
      newEntityId,
      session.user.id
    ) as unknown as Array<any> | null;

    return NextResponse.json({
      message: 'File associations updated successfully',
      updatedCount: Array.isArray(updatedFiles) ? updatedFiles.length : 0,
      files: updatedFiles || []
    });
  } catch (error: any) {
    console.error('Error updating file entity IDs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}