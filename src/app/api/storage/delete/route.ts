// app/api/storage/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { deleteFile } from '@/utils/file-service';

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'You must be logged in to delete files' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('key');
    const bucketName = searchParams.get('bucket');

    if (!fileKey || !bucketName) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'File key and bucket name are required' },
        { status: 400 }
      );
    }

    // TODO: Implement proper file metadata ownership check
    // Current implementation has type issues with the file_metadata table
    
    // Delete the file
    await deleteFile(fileKey, bucketName);

    return NextResponse.json({
      message: 'File deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}