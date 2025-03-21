// src/app/api/users/files/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/utils/prismaDB';

export async function GET(request: NextRequest) {
  try {
    // Get the Supabase client for auth
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the user ID from the query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }
    
    // Fetch files for this user
    const files = await prisma.file_upload.findMany({
      where: {
        entityId: userId,
        entityType: 'user'
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      files: files.map(file => ({
        id: file.id,
        name: file.fileName,
        url: file.fileUrl,
        type: file.fileType,
        size: file.fileSize,
        category: file.category,
        uploadedAt: file.uploadedAt
      }))
    });
  } catch (error: any) {
    console.error("Error fetching user files:", error);
    return NextResponse.json(
      { error: "Failed to fetch user files", details: error.message || error },
      { status: 500 }
    );
  }
}