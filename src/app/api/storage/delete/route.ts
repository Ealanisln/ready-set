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

    // Get file metadata to check ownership
    const { data: fileMetadata, error: metadataError } = await supabase
      .from('file_metadata')
      .select('*')
      .eq('file_key', fileKey)
      .single();

    if (metadataError || !fileMetadata) {
      return NextResponse.json(
        { error: 'Not Found', message: 'File not found' },
        { status: 404 }
      );
    }

    // Check if user owns the file
    if (fileMetadata.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to delete this file' },
        { status: 403 }
      );
    }

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