// src/app/api/file-uploads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";

// Define the bucket name in one place for easy updating
const STORAGE_BUCKET = "user-assets"; // Matching the existing bucket name in Supabase

// Add a new route to get a signed URL for a file
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }
    
    const supabase = await createClient();
    
    // First try to create a signed URL (works for private buckets)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, 60 * 30); // 30 minutes expiration
    
    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      // Fall back to public URL if signed URL fails
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      
      return NextResponse.json({
        url: publicUrl,
        isPublic: true
      });
    }
    
    return NextResponse.json({
      url: signedUrlData.signedUrl,
      isPublic: false,
      expiresIn: '30 minutes'
    });
  } catch (error: any) {
    console.error('Error generating file URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate file URL', details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("File upload API endpoint called");

  try {
    // Parse form data first to avoid issues with error handling
    const formData = await request.formData();
    console.log("Form data keys:", Array.from(formData.keys()));

    // Extract important data from the form
    const file = formData.get("file") as File;
    const entityId = formData.get("entityId") as string;
    let entityType = (formData.get("entityType") as string) || "job_application"; // Default to job_application for new hires
    const category = (formData.get("category") as string) || "resume"; // Default to resume for new hires

    // Basic validation
    if (!file) {
      console.log("Missing required field: file");
      return NextResponse.json(
        { error: "Missing required field: file" },
        { status: 400 },
      );
    }

    // Get the Supabase client for storage
    const supabase = await createClient();

    // For new hires, we'll use a temporary ID if no entityId is provided
    const tempId = entityId || `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;

    // Create a structured path for job applications
    const filePath = `job-applications/${tempId}/${fileName}`;

    console.log("Uploading file to storage path:", filePath);

    // Upload the file
    const { data: storageData, error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json(
        { error: `Error uploading ${file.name}: ${storageError.message}` },
        { status: 500 },
      );
    }

    // Get public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    // Alternative URL construction in case the standard method doesn't work
    // Some Supabase instances require a specific URL format
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const alternativeUrl = `${projectUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
    
    // For debugging - log the URLs
    console.log("Standard publicUrl:", publicUrl);
    console.log("Alternative URL:", alternativeUrl);
    
    // Use the standard URL for now, but keep the alternative as a backup
    const finalUrl = publicUrl;

    // Create the database record using Prisma
    const fileUpload = await prisma.fileUpload.create({
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: finalUrl,
        uploadedAt: new Date(),
        updatedAt: new Date(),
        category,
        isTemporary: true, // Mark as temporary until associated with a job application
        jobApplicationId: null, // Will be updated later when the job application is created
      },
    });

    console.log("Database record created successfully:", fileUpload.id);

    return NextResponse.json({
      success: true,
      file: {
        id: fileUpload.id,
        name: file.name,
        url: finalUrl,
        type: file.type,
        size: file.size,
        entityId: tempId,
        entityType,
        category,
        path: filePath,
        isTemporary: true,
      },
    });
  } catch (error: any) {
    console.error("Unexpected error in file upload:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error.message || String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  console.log("File delete API endpoint called");

  try {
    // Parse the request body first to avoid issues with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid request body - JSON parsing failed" },
        { status: 400 },
      );
    }

    const { fileId, userId } = body;

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    // Get the Supabase client
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Get the file record from the database
    const fileRecord = await prisma.fileUpload.findUnique({
      where: { id: fileId },
    });

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check user authorization if session exists
    // Allow provided userId or session user, with an optional admin bypass
    const isAuthorized =
      !session || // No session means programmatic access
      session.user.id === fileRecord.userId || // Own file
      userId === fileRecord.userId || // Provided matching userId
      (session.user.role &&
        ["admin", "super_admin"].includes(session.user.role)); // Admin role

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized - you do not own this file" },
        { status: 403 },
      );
    }

    // Extract the file path from the URL
    // Update regex to match Supabase URL pattern
    const fileUrlMatch = fileRecord.fileUrl.match(/\/storage\/v1\/object\/public\/user-assets\/([^?#]+)/);
    const filePath = fileUrlMatch?.[1];

    if (!filePath) {
      console.error(
        "Could not determine file path from URL:",
        fileRecord.fileUrl,
      );
      // Continue to delete database record even if we can't parse the path
    } else {
      // Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        // Continue to delete database record even if storage deletion fails
      }
    }

    // Delete from database
    await prisma.fileUpload.delete({
      where: { id: fileId },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        error: "Failed to delete file",
        details: error.message || String(error),
      },
      { status: 500 },
    );
  }
}
