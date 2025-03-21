// src/app/api/file-uploads/update-entity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/utils/prismaDB';

export async function POST(request: NextRequest) {
  console.log("Update file entity ID API endpoint called");
  
  try {
    // Parse request data first to separate potential JSON parsing errors
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request format. JSON parsing failed." },
        { status: 400 }
      );
    }
    
    const { tempEntityId, entityId, entityType, files } = requestData;
    
    // Validate required fields
    if (!tempEntityId) {
      return NextResponse.json(
        { error: "Missing required field: tempEntityId" },
        { status: 400 }
      );
    }
    
    if (!entityId) {
      return NextResponse.json(
        { error: "Missing required field: entityId" },
        { status: 400 }
      );
    }
    
    if (!entityType) {
      return NextResponse.json(
        { error: "Missing required field: entityType" },
        { status: 400 }
      );
    }
    
    // Get the Supabase client for auth
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if there are any files with the tempEntityId to update
    const existingFilesCount = await prisma.file_upload.count({
      where: {
        entityId: tempEntityId,
        entityType
      }
    });
    
    if (existingFilesCount === 0 && (!files || files.length === 0)) {
      console.log(`No files found with entityId: ${tempEntityId} and entityType: ${entityType}`);
      return NextResponse.json(
        { 
          success: false, 
          message: "No files found to update",
          tempEntityId,
          entityType
        },
        { status: 404 }
      );
    }
    
    // Log parameters for debugging
    console.log("Update entity parameters:", {
      tempEntityId,
      entityId,
      entityType,
      files: files ? files.length : 'none',
      existingFilesCount
    });
    
    // Prepare specific entity type IDs
    let cateringRequestId = null;
    let onDemandId = null;
    
    try {
      if (entityType === 'catering_request' && !isNaN(Number(entityId))) {
        cateringRequestId = BigInt(entityId);
      } else if (entityType === 'on_demand' && !isNaN(Number(entityId))) {
        onDemandId = BigInt(entityId);
      }
    } catch (conversionError) {
      console.error("Error converting entityId to BigInt:", conversionError);
      // Continue without the BigInt conversion
    }
    
    // Update the records
    let updatedCount = 0;
    
    try {
      if (files && Array.isArray(files) && files.length > 0) {
        // Update specific files by their keys/IDs
        const updatePromises = files.map(async (fileKey) => {
          try {
            const result = await prisma.file_upload.updateMany({
              where: {
                id: fileKey,
              },
              data: {
                entityId,
                cateringRequestId,
                onDemandId,
                updatedAt: new Date()
              }
            });
            return result;
          } catch (fileUpdateError) {
            console.error(`Error updating file with ID ${fileKey}:`, fileUpdateError);
            return { count: 0 };
          }
        });
        
        const results = await Promise.all(updatePromises);
        updatedCount = results.reduce((acc, result) => acc + (result?.count || 0), 0);
      } else {
        // Update all files with the given tempEntityId
        const result = await prisma.file_upload.updateMany({
          where: {
            entityId: tempEntityId,
            entityType
          },
          data: {
            entityId,
            cateringRequestId,
            onDemandId,
            updatedAt: new Date()
          }
        });
        
        updatedCount = result.count;
      }
    } catch (updateError) {
      console.error("Error during database update:", updateError);
      return NextResponse.json(
        { 
          error: "Database error while updating files", 
          details: updateError instanceof Error ? updateError.message : String(updateError)
        },
        { status: 500 }
      );
    }
    
    console.log(`Updated ${updatedCount} file records`);
    
    // If we're updating file storage paths, handle that here
    if (updatedCount > 0) {
      try {
        // Get the updated files to potentially update storage paths
        const updatedFiles = await prisma.file_upload.findMany({
          where: {
            entityId,
            entityType
          }
        });
        
        // Log what files were updated - useful for debugging
        console.log(`Found ${updatedFiles.length} updated files that might need storage path updates`);
        
        // Here you could implement storage path updates if needed
        // For example, moving files in Supabase storage to a new location
        // This would depend on your storage structure
      } catch (storageError) {
        console.warn("Note: Files were updated in database but storage paths may not be synced:", storageError);
        // Don't fail the request if only the storage sync fails
      }
    }
    
    return NextResponse.json({
      success: true,
      updatedCount,
      message: updatedCount > 0 
        ? "Entity IDs updated successfully" 
        : "No files were updated - check if the files exist"
    });
  } catch (error: any) {
    console.error("Unexpected error updating entity IDs:", error);
    return NextResponse.json(
      { 
        error: "Failed to update entity IDs", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Support for PUT method as well, for RESTful API design
export async function PUT(request: NextRequest) {
  return POST(request);
}