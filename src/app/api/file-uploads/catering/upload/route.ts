import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/utils/prismaDB';

export async function POST(request: NextRequest) {
  console.log("Catering file upload API endpoint called");
  
  try {
    // Get the Supabase client for auth and storage
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("Unauthorized - No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get form data from the request
    const formData = await request.formData();
    console.log("Form data keys:", Array.from(formData.keys()));
    
    // Extract important data from the form
    const file = formData.get('file') as File;
    const entityId = formData.get('entityId') as string;
    const entityType = formData.get('entityType') as string || 'catering_request';
    const category = formData.get('category') as string || 'attachment';
    const userId = session.user.id; // Use the authenticated user's ID
    
    // Get userType from form data, or determine it from the user's profile
    let userType = formData.get('userType') as string;
    
    // If userType isn't provided in the form, try to get it from the user profile
    if (!userType) {
      try {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', userId)
          .single();
        
        userType = userProfile?.type || 'client'; // Default to 'client' if no type found
      } catch (err) {
        console.log("Error fetching user role, defaulting to 'client':", err);
        userType = 'client';
      }
    }
    
    // Log parameters for debugging
    console.log("Upload parameters:", {
      userId,
      entityId,
      entityType,
      category,
      userType,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    });
    
    if (!file || !entityId) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;
    
    // Create a structured path with userType/userId/fileName
    const filePath = `${userType}/${userId}/${fileName}`;
    
    console.log("Uploading file to storage path:", filePath);
    
    // Upload the file to catering-files bucket
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('catering-files')  // This should be the bucket name you want
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });
      
    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json(
        { error: "Failed to upload file to storage", details: storageError },
        { status: 500 }
      );
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('catering-files')
      .getPublicUrl(filePath);
    
    console.log("Generated public URL:", publicUrl);
    
    // Create record in the file_upload table
    try {
      console.log("Creating database record with fields:", {
        userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: publicUrl,
        entityType,
        entityId,
        category,
        storagePath: filePath // Log the storage path for debugging
      });
      
      // Prepare specific entity type IDs
      let cateringRequestId = null;
      
      if (!isNaN(Number(entityId))) {
        cateringRequestId = BigInt(entityId).toString();
      }
      
      // Create the database record using Prisma
      const fileUpload = await prisma.fileUpload.create({
        data: {
          userId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: publicUrl,
          category,
          cateringRequestId
        }
      });
      
      console.log("Database record created successfully:", fileUpload.id);
      
      return NextResponse.json({
        success: true,
        file: {
          id: fileUpload.id,
          name: file.name,
          url: publicUrl,
          type: file.type,
          size: file.size,
          entityId,
          entityType,
          category,
          storagePath: filePath // Return the storage path in the response
        }
      });
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      
      // More detailed error logging for debugging
      if (dbError.meta) {
        console.error("Database error metadata:", dbError.meta);
      }
      
      return NextResponse.json(
        { 
          error: "Failed to save file metadata to database", 
          details: dbError.message || dbError,
          code: dbError.code
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in catering file upload:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred", 
        details: error.message || error
      },
      { status: 500 }
    );
  }
}