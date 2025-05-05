// src/app/api/file-uploads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

// Define storage buckets in one place for easy updating
const STORAGE_BUCKETS = {
  DEFAULT: "user-assets",
  FILE_UPLOADER: "fileUploader",
  CATERING: "catering-files"
};

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
      .from(STORAGE_BUCKETS.DEFAULT)
      .createSignedUrl(path, 60 * 30); // 30 minutes expiration
    
    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      // Fall back to public URL if signed URL fails
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKETS.DEFAULT)
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
    const bucketName = (formData.get("bucketName") as string);
    
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
    const tempId = entityId 
      ? (entityId.startsWith('temp-') ? entityId : `temp-${entityId}`) 
      : `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    console.log(`Using entity ID for file upload: ${tempId}`);
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;

    // Create a structured path based on entityType
    let filePath;
    let storageBucket;
    
    // Convert entityType to a consistent format
    const normalizedEntityType = entityType.toLowerCase();
    console.log(`Normalized entityType: ${normalizedEntityType}`);
    
    // Determine which bucket to use based on entity type
    if (normalizedEntityType === "catering") {
      storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
      filePath = `orders/catering/${tempId}/${fileName}`;
      console.log("Using orders/catering path for catering order");
    } 
    else if (normalizedEntityType === "on_demand") {
      storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
      filePath = `orders/on-demand/${tempId}/${fileName}`;
      console.log("Using orders/on-demand path for on-demand order");
    }
    else if (normalizedEntityType === "job_application") {
      // Verify this is really a job application by checking if the ID matches a valid job application
      try {
        const jobApp = await prisma.jobApplication.findUnique({
          where: { id: entityId }
        });
        
        if (jobApp) {
          console.log("Valid job application ID, using job-applications path");
          filePath = `job-applications/${tempId}/${fileName}`;
          storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
        } else {
          // If category suggests this is a catering order but tagged as job application
          if (normalizedCategory === "catering-order") {
            console.log("Catering order detected by category, using orders/catering path");
            filePath = `orders/catering/${tempId}/${fileName}`;
            storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
          } else if (normalizedCategory === "on-demand") {
            console.log("On-demand order detected by category, using orders/on-demand path");
            filePath = `orders/on-demand/${tempId}/${fileName}`;
            storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
          } else {
            console.log("Invalid job application ID, using general path");
            filePath = `general/${tempId}/${fileName}`;
            storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
          }
        }
      } catch (error) {
        console.error("Error checking job application:", error);
        filePath = `general/${tempId}/${fileName}`;
        storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
      }
    }
    // Default handling for other types
    else {
      filePath = `${normalizedEntityType || 'general'}/${tempId}/${fileName}`;
      storageBucket = bucketName || STORAGE_BUCKETS.DEFAULT;
    }

    // If bucketName was explicitly provided in the request, use that
    if (bucketName) {
      storageBucket = bucketName;
    }

    console.log(`Uploading file to storage path: ${filePath} in bucket: ${storageBucket}`);

    // Instead of trying to create the bucket, we'll just check if it's accessible
    try {
      const { data, error: listError } = await supabase.storage
        .from(storageBucket)
        .list();
      
      if (listError) {
        console.error(`Error accessing bucket '${storageBucket}':`, listError);
        
        if (listError.message.includes("not found")) {
          // Try fallback to default bucket if the requested bucket is not found
          console.log(`Bucket '${storageBucket}' not found, falling back to '${STORAGE_BUCKETS.DEFAULT}'`);
          storageBucket = STORAGE_BUCKETS.DEFAULT;
        }
      } else {
        console.log(`Bucket '${storageBucket}' is accessible`);
      }
    } catch (bucketError) {
      console.error("Exception checking bucket:", bucketError);
      // Fall back to default bucket
      storageBucket = STORAGE_BUCKETS.DEFAULT;
    }

    // Upload the file
    const { data: storageData, error: storageError } = await supabase.storage
      .from(storageBucket)
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
        errorMessage = `Storage bucket '${storageBucket}' not found. Please contact support.`;
        console.error(`Bucket '${storageBucket}' does not exist or is not accessible.`);
        statusCode = 404;
      } else if (storageError.message.includes("permission")) {
        errorMessage = `Permission denied to upload to '${storageBucket}'. Please contact support.`;
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
    } = supabase.storage.from(storageBucket).getPublicUrl(filePath);

    // Alternative URL construction in case the standard method doesn't work
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const alternativeUrl = `${projectUrl}/storage/v1/object/public/${storageBucket}/${filePath}`;
    
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
      if (normalizedCategory === "catering-order" || normalizedCategory === "catering" || entityType === "catering") {
        console.log(`Evaluating cateringRequestId for: ${entityId}`);
        
        // Only set cateringRequestId if it's NOT a temporary ID
        if (entityId && !entityId.startsWith('temp-')) {
          console.log(`Setting cateringRequestId to: ${entityId}`);
          dbData.cateringRequestId = entityId;
          
          // Double-check the catering request exists
          try {
            const cateringRequest = await prisma.cateringRequest.findUnique({
              where: { id: entityId }
            });
            
            if (cateringRequest) {
              console.log(`Verified catering request exists: ID=${entityId}`);
              // Make sure category is set consistently to improve retrieval
              dbData.category = "catering-order";
              dbData.isTemporary = false;
            } else {
              console.warn(`Catering request with ID ${entityId} not found in database`);
              dbData.isTemporary = true;
              // Clear the ID to avoid database errors
              dbData.cateringRequestId = null;
            }
          } catch (err) {
            console.error("Error verifying catering request:", err);
            dbData.isTemporary = true;
            // Clear the ID to avoid database errors
            dbData.cateringRequestId = null;
          }
        } else if (entityId) {
          console.log(`Skipping cateringRequestId for temporary ID: ${entityId}`);
          // For temporary IDs, mark the file as temporary and do NOT set the cateringRequestId
          dbData.isTemporary = true;
          dbData.cateringRequestId = null;
          dbData.category = "catering-order";
          
          // Store 'temp-entityId' in category instead to help with retrieval
          dbData.category = `catering-order::${entityId}`;
        }
      } else if (normalizedCategory === "on-demand" || entityType === "on_demand") {
        // Similar logic for on-demand requests
        if (entityId && !entityId.startsWith('temp-')) {
          console.log(`Setting onDemandId to: ${entityId}`);
          dbData.onDemandId = entityId;
          dbData.isTemporary = false;
        } else if (entityId) {
          console.log(`Skipping onDemandId for temporary ID: ${entityId}`);
          dbData.isTemporary = true;
          dbData.onDemandId = null;
          // Store in category for retrieval
          dbData.category = `on-demand::${entityId}`;
        }
      } else if (entityType === "job_application") {
        // Only set jobApplicationId if it's really a job application (verified earlier)
        if (entityId && !entityId.startsWith('temp-')) {
          const jobApp = await prisma.jobApplication.findUnique({
            where: { id: entityId }
          });
          
          if (jobApp) {
            console.log(`Setting jobApplicationId to: ${entityId} (verified)`);
            dbData.jobApplicationId = entityId;
            dbData.isTemporary = false;
          } else {
            console.log(`JobApplication ${entityId} not found, not setting foreign key`);
            dbData.jobApplicationId = null;
            dbData.isTemporary = true;
            // Store in category for retrieval
            dbData.category = `job-application::${entityId}`;
          }
        }
      } else if (entityType === "user") {
        // For user files, we need to set the userId field
        if (entityId && !entityId.startsWith('temp-')) {
          console.log(`Setting userId to: ${entityId} for user file`);
          dbData.userId = entityId;
          
          // Check if user exists
          try {
            const userProfile = await prisma.profile.findUnique({
              where: { id: entityId }
            });
            
            if (userProfile) {
              console.log(`Verified user exists: ID=${entityId}`);
              dbData.isTemporary = false;
            } else {
              console.warn(`User with ID ${entityId} not found in database`);
              dbData.isTemporary = true;
              // Clear the ID to avoid database errors
              dbData.userId = null;
            }
          } catch (err) {
            console.error("Error verifying user:", err);
            dbData.isTemporary = true;
            dbData.userId = null;
          }
        } else if (entityId) {
          dbData.userId = null;
          dbData.isTemporary = true;
          // Store in category for retrieval
          dbData.category = `user::${entityId}`;
        }
      } else {
        console.log(`No specific entity ID field set for type: ${entityType} and category: ${normalizedCategory}`);
        // For safety, ensure all fields are null if undefined or temp
        if (entityId && entityId.startsWith('temp-')) {
          dbData.isTemporary = true;
          dbData.cateringRequestId = null;
          dbData.onDemandId = null;
          dbData.jobApplicationId = null;
          dbData.userId = null;
          // Store temp ID in category
          dbData.category = `${normalizedCategory || entityType}::${entityId}`;
        }
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
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('fileUrl');
    const fileIdParam = searchParams.get('fileId');

    console.log('DELETE /api/file-uploads called with params:', {
      fileUrl,
      fileId: fileIdParam
    });

    if (!fileUrl && !fileIdParam) {
      return NextResponse.json(
        { error: "Either fileUrl or fileId is required" },
        { status: 400 },
      );
    }

    // Initialize Prisma client to find and delete the file record
    const prisma = new PrismaClient();
    let fileRecord;

    if (fileIdParam) {
      // Find file by ID
      fileRecord = await prisma.fileUpload.findUnique({
        where: { id: fileIdParam },
      });

      if (!fileRecord) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 },
        );
      }

      console.log('Found file record by ID:', fileRecord.fileName);
    } else {
      // Find file by URL
      fileRecord = await prisma.fileUpload.findFirst({
        where: { 
          fileUrl: fileUrl as string 
        },
      });

      if (!fileRecord) {
        console.log('File record not found for URL:', fileUrl);
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 },
        );
      }

      console.log('Found file record by URL:', fileRecord.fileName);
    }

    // Determine the bucket and path from the fileUrl
    let bucketName = STORAGE_BUCKETS.DEFAULT;
    let filePath = '';

    try {
      // Extract path from the fileUrl
      // Example URL: https://example.supabase.co/storage/v1/object/public/bucket-name/path/to/file.ext
      const url = new URL(fileRecord.fileUrl);
      const pathParts = url.pathname.split('/');
      
      // Find the index of "public" which comes before the bucket name
      const publicIndex = pathParts.findIndex(part => part === 'public');
      
      if (publicIndex !== -1 && publicIndex + 1 < pathParts.length) {
        bucketName = pathParts[publicIndex + 1];
        // The path is everything after the bucket name
        filePath = pathParts.slice(publicIndex + 2).join('/');
        
        console.log('Extracted storage details:', { bucketName, filePath });
      } else {
        console.log('Could not parse storage path from URL:', fileRecord.fileUrl);
        // Use default path construction as fallback
        filePath = fileRecord.fileUrl.split('/').pop() || '';
      }
    } catch (error) {
      console.error('Error parsing file URL:', error);
      // Use default path construction as fallback
      filePath = fileRecord.fileUrl.split('/').pop() || '';
    }

    // Get Supabase client
    const supabase = await createClient();

    // Delete from Supabase storage
    if (filePath) {
      console.log(`Attempting to delete from bucket '${bucketName}', path: ${filePath}`);
      
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue anyway to delete the database record
      } else {
        console.log('Successfully deleted from storage');
      }
    } else {
      console.log('No valid file path to delete from storage');
    }

    // Delete from database
    await prisma.fileUpload.delete({
      where: { id: fileRecord.id },
    });

    console.log('Successfully deleted file record from database');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: error.message || String(error) },
      { status: 500 },
    );
  }
}
