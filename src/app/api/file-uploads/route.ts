// src/app/api/file-uploads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { STORAGE_BUCKETS } from "@/utils/file-service";

// Add a new route to get a signed URL for a file
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid authorization header" },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Verify the token by getting the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }
    
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
    const category = (formData.get("category") as string) || "";
    console.log("File upload request received with category:", category);

    // Ensure job-applications/temp paths are properly handled
    let uploadPath = "temp";
    
    // Special handling for job application categories with the new path structure
    if (category.startsWith("job-applications/temp/")) {
      uploadPath = category; // Use the full path as provided 
      console.log("Using full category path for upload:", uploadPath);
    } else if (category) {
      // For other categories, make a simple prefix/category hierarchy
      uploadPath = `${category}`;
    }
    
    console.log("Final upload path:", uploadPath);
    
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

    // Handle entity IDs in a consistent way
    // Don't add temp- prefix to IDs that already have temp_ prefix (job applications)
    let finalEntityId = '';
    if (entityId) {
      if (entityId.startsWith('temp_') || entityId.startsWith('temp-')) {
        // For temporary IDs, use as-is
        finalEntityId = entityId;
        console.log(`Using temporary ID as-is: ${finalEntityId}`);
      } else {
        // For normal IDs, use directly without temp prefix
        finalEntityId = entityId;
      }
    } else {
      // Generate a new temporary ID if none provided
      finalEntityId = `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    }
    
    console.log(`Using entity ID for file upload: ${finalEntityId}`);
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;

    // Create a structured path based on entityType
    let filePath;
    let storageBucket = (bucketName || STORAGE_BUCKETS.DEFAULT) as string;
    
    // Convert entityType to a consistent format
    const normalizedEntityType = entityType.toLowerCase();
    console.log(`Normalized entityType: ${normalizedEntityType}`);
    
    // Determine which bucket and path to use based on entity type
    if (normalizedEntityType === "catering") {
      // Consistent path for catering orders
      filePath = `orders/catering/${finalEntityId}/${fileName}`;
      console.log("Using orders/catering path for catering order");
    } 
    else if (normalizedEntityType === "on_demand") {
      // Consistent path for on-demand orders  
      filePath = `orders/on-demand/${finalEntityId}/${fileName}`;
      console.log("Using orders/on-demand path for on-demand order");
    }
    else if (normalizedEntityType === "job_application") {
      // For job application type, check if ID is a temp ID or real UUID
      if (finalEntityId.startsWith('temp_') || finalEntityId.startsWith('temp-')) {
        // Skip UUID validation for temp job application IDs
        console.log("Using job-applications/temp path for temp job application uploads");
        filePath = `job-applications/temp/${finalEntityId}/${fileName}`;
      } else {
        // Only try to validate as UUID for non-temp IDs
        try {
          const jobApp = await prisma.jobApplication.findUnique({
            where: { id: finalEntityId }
          });
          
          if (jobApp) {
            console.log("Valid job application ID, using job-applications path");
            filePath = `job-applications/${jobApp.id}/${fileName}`;
          } else {
            // Check if we have a specific upload path from the category
            if (uploadPath && uploadPath.startsWith("job-applications/temp/")) {
              console.log(`Using specified upload path: ${uploadPath}`);
              filePath = `${uploadPath}/${finalEntityId}/${fileName}`;
            }
            // If category suggests this is a catering order but tagged as job application
            else if (normalizedCategory === "catering-order") {
              console.log("Catering order detected by category, using orders/catering path");
              filePath = `orders/catering/${finalEntityId}/${fileName}`;
            } else if (normalizedCategory === "on-demand") {
              console.log("On-demand order detected by category, using orders/on-demand path");
              filePath = `orders/on-demand/${finalEntityId}/${fileName}`;
            } else {
              console.log("Using job-applications/temp path for temp job application uploads");
              filePath = `job-applications/temp/${finalEntityId}/${fileName}`;
            }
          }
        } catch (error) {
          console.error("Error checking job application:", error);
          filePath = `job-applications/temp/${finalEntityId}/${fileName}`;
        }
      }
    }
    else if (normalizedEntityType === "user") {
      // Consistent path for user files
      filePath = `users/${finalEntityId}/${fileName}`;
      console.log("Using users path for user files");
    }
    // Default handling for other types
    else {
      filePath = `${normalizedEntityType || 'general'}/${finalEntityId}/${fileName}`;
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
      // Set isTemporary flag based on entityId format
      isTemporary: finalEntityId ? (finalEntityId.startsWith('temp_') || finalEntityId.startsWith('temp-')) : true,
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
        console.log(`Evaluating cateringRequestId for: ${finalEntityId}`);
        
        // Only set cateringRequestId if it's NOT a temporary ID
        if (finalEntityId && !finalEntityId.startsWith('temp-') && !finalEntityId.startsWith('temp_')) {
          console.log(`Setting cateringRequestId to: ${finalEntityId}`);
          dbData.cateringRequestId = finalEntityId;
          
          // Double-check the catering request exists
          try {
            const cateringRequest = await prisma.cateringRequest.findUnique({
              where: { id: finalEntityId }
            });
            
            if (cateringRequest) {
              console.log(`Verified catering request exists: ID=${finalEntityId}`);
              // Make sure category is set consistently to improve retrieval
              dbData.category = "catering-order";
              dbData.isTemporary = false;
            } else {
              console.warn(`Catering request with ID ${finalEntityId} not found in database`);
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
        } else if (finalEntityId) {
          console.log(`Skipping cateringRequestId for temporary ID: ${finalEntityId}`);
          // For temporary IDs, mark the file as temporary and do NOT set the cateringRequestId
          dbData.isTemporary = true;
          dbData.cateringRequestId = null;
          dbData.category = "catering-order";
        }
      } else if (normalizedCategory === "on-demand" || entityType === "on_demand") {
        // Similar logic for on-demand requests
        if (finalEntityId && !finalEntityId.startsWith('temp-') && !finalEntityId.startsWith('temp_')) {
          console.log(`Setting onDemandId to: ${finalEntityId}`);
          dbData.onDemandId = finalEntityId;
          dbData.isTemporary = false;
        } else if (finalEntityId) {
          console.log(`Skipping onDemandId for temporary ID: ${finalEntityId}`);
          dbData.isTemporary = true;
          dbData.onDemandId = null;
          // Store in category for retrieval
          dbData.category = `on-demand`;
        }
      } else if (entityType === "job_application") {
        // Only set jobApplicationId if it's really a job application (verified earlier)
        // Skip UUID validation completely for temp_ format IDs
        if (finalEntityId && !finalEntityId.startsWith('temp-') && !finalEntityId.startsWith('temp_')) {
          try {
            const jobApp = await prisma.jobApplication.findUnique({
              where: { id: finalEntityId }
            });
            
            if (jobApp) {
              console.log(`Setting jobApplicationId to: ${finalEntityId} (verified)`);
              dbData.jobApplicationId = finalEntityId;
              dbData.isTemporary = false;
            } else {
              console.log(`JobApplication ${finalEntityId} not found, not setting foreign key`);
              dbData.jobApplicationId = null;
              dbData.isTemporary = true;
              // Keep the original category rather than modifying it
            }
          } catch (error) {
            console.log(`Error finding job application with ID ${finalEntityId}, treating as temporary`, error);
            dbData.jobApplicationId = null;
            dbData.isTemporary = true;
          }
        } else if (finalEntityId) {
          // For temp IDs, don't try to look up in database at all
          console.log(`Using temporary ID for job application: ${finalEntityId}`);
          dbData.jobApplicationId = null;
          dbData.isTemporary = true;
          // Keep the original category rather than modifying it
        }
      } else if (entityType === "user") {
        // For user files, we need to set the userId field
        if (finalEntityId && !finalEntityId.startsWith('temp-') && !finalEntityId.startsWith('temp_')) {
          console.log(`Setting userId to: ${finalEntityId} for user file`);
          dbData.userId = finalEntityId;
          
          // Check if user exists
          try {
            const userProfile = await prisma.profile.findUnique({
              where: { id: finalEntityId }
            });
            
            if (userProfile) {
              console.log(`Verified user exists: ID=${finalEntityId}`);
              dbData.isTemporary = false;
            } else {
              console.warn(`User with ID ${finalEntityId} not found in database`);
              dbData.isTemporary = true;
              // Clear the ID to avoid database errors
              dbData.userId = null;
            }
          } catch (err) {
            console.error("Error verifying user:", err);
            dbData.isTemporary = true;
            dbData.userId = null;
          }
        } else if (finalEntityId) {
          dbData.userId = null;
          dbData.isTemporary = true;
          // Store in category for retrieval
          dbData.category = `user`;
        }
      } else {
        console.log(`No specific entity ID field set for type: ${entityType} and category: ${normalizedCategory}`);
        // For safety, ensure all fields are null if undefined or temp
        if (finalEntityId && (finalEntityId.startsWith('temp-') || finalEntityId.startsWith('temp_'))) {
          dbData.isTemporary = true;
          dbData.cateringRequestId = null;
          dbData.onDemandId = null;
          dbData.jobApplicationId = null;
          dbData.userId = null;
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
        entityId: finalEntityId,
        entityType: entityType,
        category: normalizedCategory,
        path: filePath,
        isTemporary: dbData.isTemporary,
        bucketName: storageBucket,
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
        bucketName = pathParts[publicIndex + 1] as typeof STORAGE_BUCKETS.DEFAULT;
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
