// app/api/storage/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { saveFileMetadata, STORAGE_BUCKETS } from '@/utils/file-service';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'You must be logged in to upload files' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = formData.get('bucket') as string || STORAGE_BUCKETS.USER_FILES;
    const entityType = formData.get('entityType') as string || 'default';
    const entityId = formData.get('entityId') as string || `temp-${uuidv4()}`;
    const category = formData.get('category') as string || undefined;
    const folder = formData.get('folder') as string || session.user.id;

    if (!file) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Payload Too Large', message: 'File exceeds the 10MB size limit' },
        { status: 413 }
      );
    }

    // Generate a unique filename to prevent collisions
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    // Create a path with user ID to enforce isolation
    const filePath = `${folder}/${uniqueFileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      return NextResponse.json(
        { error: 'Storage Error', message: error.message },
        { status: 500 }
      );
    }

    // Get the URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    // Save file metadata to database
    const metadata = await saveFileMetadata({
      file_key: data.path,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_size: file.size,
      file_type: file.type,
      entity_type: entityType,
      entity_id: entityId,
      user_id: session.user.id,
      category,
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: {
        key: data.path,
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        id: metadata.id,
        entityId,
        entityType,
      }
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}