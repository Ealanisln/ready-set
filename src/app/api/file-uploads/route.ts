// src/app/api/file-uploads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

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

  // Instantiate Prisma Client within the handler
  const prisma = new PrismaClient();

  try {
    // Parse form data first to avoid issues with error handling
    const formData = await request.formData();
    console.log("Form data keys:", Array.from(formData.keys()));

    // Extract important data from the form
    const file = formData.get("file") as File;
    const entityId = formData.get("entityId") as string;
    let entityType = (formData.get("entityType") as string) || "job_application"; // Default value
    const category = (formData.get("category") as string) || "document"; // Default category
    const bucketName = (formData.get("bucketName") as string) || STORAGE_BUCKET;
    
    // Normalize category if provided
    const normalizedCategory = category.toLowerCase();
    
    // Correct entityType based on category if needed
    // This helps ensure consistent entity types
    if (normalizedCategory === "catering-order") {
      entityType = "catering";
      console.log("Corrected entityType to 'catering' based on category 'catering-order'");
    } else if (normalizedCategory === "on-demand") {
      entityType = "on_demand";
      console.log("Corrected entityType to 'on_demand' based on category 'on-demand'");
    }
    
    console.log("Upload request details:", {
      entityType,
      entityId,
      category: normalizedCategory,
      fileName: file?.name,
      fileSize: file?.size,
    });

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

    // Use provided entityId or generate a temporary one
    const tempId = entityId || `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;

    // Create a structured path based on entityType
    let filePath;
    
    // Convert entityType to a consistent format
    const normalizedEntityType = entityType.toLowerCase();
    console.log(`Normalized entityType: ${normalizedEntityType}`);
    
    // Special handling for catering requests using order ID
    if (normalizedEntityType === "catering") {
      // For catering orders, always use the catering path
      filePath = `orders/catering/${tempId}/${fileName}`;
      console.log("Using orders/catering path for catering order");
    } 
    // Special handling for on-demand requests
    else if (normalizedEntityType === "on_demand") {
      // For on-demand orders, always use the on-demand path
      filePath = `orders/on-demand/${tempId}/${fileName}`;
      console.log("Using orders/on-demand path for on-demand order");
    }
    // Special handling for job applications
    else if (normalizedEntityType === "job_application") {
      // Verify this is really a job application by checking if the ID matches a valid job application
      try {
        const jobApp = await prisma.jobApplication.findUnique({
          where: { id: entityId }
        });
        
        if (jobApp) {
          console.log("Valid job application ID, using job-applications path");
          filePath = `job-applications/${tempId}/${fileName}`;
        } else {
          // If category suggests this is a catering order but tagged as job application
          if (normalizedCategory === "catering-order") {
            console.log("Catering order detected by category, using orders/catering path");
            filePath = `orders/catering/${tempId}/${fileName}`;
          } else if (normalizedCategory === "on-demand") {
            console.log("On-demand order detected by category, using orders/on-demand path");
            filePath = `orders/on-demand/${tempId}/${fileName}`;
          } else {
            console.log("Invalid job application ID, using general path");
            filePath = `general/${tempId}/${fileName}`;
          }
        }
      } catch (error) {
        console.error("Error checking job application:", error);
        filePath = `general/${tempId}/${fileName}`;
      }
    }
    // Default handling for other types
    else {
      filePath = `${normalizedEntityType || 'general'}/${tempId}/${fileName}`;
    }

    console.log(`Uploading file to storage path: ${filePath} in bucket: ${bucketName}`);

    // Instead of trying to create the bucket, we'll just check if it's accessible
    try {
      const { data, error: listError } = await supabase.storage
        .from(bucketName)
        .list();
      
      if (listError) {
        console.error(`Error accessing bucket '${bucketName}':`, listError);
        
        if (listError.message.includes("not found")) {
          return NextResponse.json(
            { error: `Storage bucket '${bucketName}' not found. Please contact an administrator.` },
            { status: 404 }
          );
        }
      } else {
        console.log(`Bucket '${bucketName}' is accessible`);
      }
    } catch (bucketError) {
      console.error("Exception checking bucket:", bucketError);
      // Continue anyway, as the upload operation will fail if the bucket is inaccessible
    }

    // Upload the file
    const { data: storageData, error: storageError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      
      // Provide more specific error message based on error type
      let errorMessage = `Error uploading ${file.name}: ${storageError.message}`;
      let statusCode = 500;
      
      if (storageError.message.includes("Bucket not found")) {
        errorMessage = `Storage bucket '${bucketName}' not found. Please contact support.`;
        console.error(`Bucket '${bucketName}' does not exist or is not accessible.`);
        statusCode = 404;
      } else if (storageError.message.includes("permission")) {
        errorMessage = `Permission denied to upload to '${bucketName}'. Please contact support.`;
        statusCode = 403;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode },
      );
    }

    // Get public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    // Alternative URL construction in case the standard method doesn't work
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const alternativeUrl = `${projectUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
    
    // For debugging - log the URLs
    console.log("Standard publicUrl:", publicUrl);
    console.log("Alternative URL:", alternativeUrl);
    
    // Use the standard URL for now, but keep the alternative as a backup
    const finalUrl = publicUrl;

    // Prepare database record data based on entityType
    const dbData: any = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: finalUrl,
      uploadedAt: new Date(),
      updatedAt: new Date(),
      category: normalizedCategory,
      isTemporary: !entityId, // Only mark as temporary if no real entityId provided
      // Set all IDs to null by default
      cateringRequestId: null,
      onDemandId: null,
      jobApplicationId: null,
      userId: null
    };

    // CRITICAL FIX: Set the proper foreign key based on either category or entityType
    // This ensures files are associated with the correct records
    console.log(`Setting entity ID for type: ${entityType} and category: ${normalizedCategory}`);
    
    try {
      // First, prioritize category for determining the correct foreign key
      if (normalizedCategory === "catering-order" || entityType === "catering") {
        console.log(`Setting cateringRequestId to: ${entityId}`);
        dbData.cateringRequestId = entityId;
        
        // Double-check the catering request exists
        try {
          const cateringRequest = await prisma.cateringRequest.findUnique({
            where: { id: entityId }
          });
          
          if (cateringRequest) {
            console.log(`Verified catering request exists: ID=${entityId}`);
          } else {
            console.warn(`Catering request with ID ${entityId} not found in database - still setting ID`);
          }
        } catch (err) {
          console.error("Error verifying catering request:", err);
          // Still continue with setting the ID
        }
      } else if (normalizedCategory === "on-demand" || entityType === "on_demand") {
        console.log(`Setting onDemandId to: ${entityId}`);
        dbData.onDemandId = entityId;
      } else if (entityType === "job_application") {
        // Only set jobApplicationId if it's really a job application (verified earlier)
        const jobApp = await prisma.jobApplication.findUnique({
          where: { id: entityId }
        });
        
        if (jobApp) {
          console.log(`Setting jobApplicationId to: ${entityId} (verified)`);
          dbData.jobApplicationId = entityId;
        } else {
          console.log(`JobApplication ${entityId} not found, not setting foreign key`);
        }
      } else if (entityType === "user") {
        // For user files, we need to set the userId field
        console.log(`Setting userId to: ${entityId} for user file`);
        dbData.userId = entityId;
        
        // Check if user exists
        try {
          const userProfile = await prisma.profile.findUnique({
            where: { id: entityId }
          });
          
          if (userProfile) {
            console.log(`Verified user exists: ID=${entityId}`);
          } else {
            console.warn(`User with ID ${entityId} not found in database - still setting ID`);
          }
        } catch (err) {
          console.error("Error verifying user:", err);
          // Still continue with setting the ID
        }
      } else {
        console.log(`No specific entity ID field set for type: ${entityType} and category: ${normalizedCategory}`);
      }
    } catch (error) {
      console.error("Error processing entity ID:", error);
      // Safety: reset all foreign keys to null if there was an error
      dbData.cateringRequestId = null;
      dbData.onDemandId = null;
      dbData.jobApplicationId = null;
      dbData.userId = null;
    }

    // Create the database record
    console.log("Creating database record with data:", dbData);
    const fileUpload = await prisma.fileUpload.create({
      data: dbData,
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
        entityType: entityType,
        category: normalizedCategory,
        path: filePath,
        isTemporary: !entityId,
        bucketName,
      },
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { 
        error: "File upload failed", 
        details: error.message || String(error)
      },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma Client after use
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  console.log("File delete API endpoint called");

  // Instantiate Prisma Client within the handler
  const prisma = new PrismaClient();

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
  } finally {
    // Disconnect Prisma Client after use
    await prisma.$disconnect();
  }
}
