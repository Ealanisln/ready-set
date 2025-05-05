import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PUT(request: NextRequest) {
  try {
    const { oldEntityId, newEntityId, entityType } = await request.json();

    if (!oldEntityId || !newEntityId) {
      return NextResponse.json(
        { error: "Both old and new entity IDs are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Allow operations even without session for server-to-server calls
    const hasSession = !!session;
    console.log("Session available:", hasSession);

    console.log("Update entity request:", {
      oldEntityId,
      newEntityId,
      entityType,
      userId: session?.user?.id || 'server-action',
    });

    // Get all files with temp entity ID, using different approaches
    let fileRecords = await prisma.fileUpload.findMany({
      where: {
        OR: [
          // Look for direct matches in entity ID fields (legacy records)
          { 
            isTemporary: true,
            cateringRequestId: oldEntityId.startsWith('temp-') ? null : oldEntityId 
          }
          // Note: Removed metadata check since it's not in the schema
        ]
      },
      select: {
        id: true,
        fileUrl: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        category: true,
        isTemporary: true,
        uploadedAt: true,
        updatedAt: true,
        userId: true,
        cateringRequestId: true,
        onDemandId: true,
        jobApplicationId: true
      },
    });

    console.log(
      `Found ${fileRecords.length} files to update from ${oldEntityId} to ${newEntityId}`,
    );

    if (fileRecords.length === 0) {
      // Check for raw path matches in the fileUrl field
      const pathFileRecords = await prisma.fileUpload.findMany({
        where: {
          isTemporary: true,
          fileUrl: {
            contains: oldEntityId
          }
        },
        select: {
          id: true,
          fileUrl: true,
          fileName: true,
          fileSize: true,
          fileType: true,
          category: true,
          isTemporary: true,
          uploadedAt: true,
          updatedAt: true,
          userId: true,
          cateringRequestId: true,
          onDemandId: true,
          jobApplicationId: true
        }
      });

      if (pathFileRecords.length > 0) {
        console.log(`Found ${pathFileRecords.length} files with path matching ${oldEntityId}`);
        fileRecords = fileRecords.concat(pathFileRecords);
      } else {
        // If still no files found, check if any files already exist with the new entity ID
        const newIdFileRecords = await prisma.fileUpload.findMany({
          where: {
            OR: [
              { cateringRequestId: newEntityId },
              { fileUrl: { contains: newEntityId } }
            ]
          },
          select: {
            id: true,
          },
        });

        if (newIdFileRecords.length > 0) {
          console.log(
            `Found ${newIdFileRecords.length} files already using entityId: ${newEntityId}`,
          );
          // Files are already using the new ID, so we consider this a success
          return NextResponse.json({
            success: true,
            message: "Files are already associated with the new entity ID",
            updatedCount: 0,
            alreadyUpdated: newIdFileRecords.length,
          });
        }

        // No files found with old or new entityId, which is unusual but not necessarily an error
        console.log(
          `No files found with entityId: ${oldEntityId} or ${newEntityId}`,
        );
        return NextResponse.json({
          success: true,
          message: "No files found to update",
          updatedCount: 0,
        });
      }
    }

    // Process the file records
    let updatedCount = 0;

    for (const file of fileRecords) {
      console.log(`Processing file ${file.id} with URL ${file.fileUrl}`);

      try {
        // First update the DB record
        await prisma.fileUpload.update({
          where: { id: file.id },
          data: {
            cateringRequestId: newEntityId,
            isTemporary: false,
            // Remove metadata field as it's not in the schema
          }
        });

        // Now try to move the file in storage
        if (file.fileUrl) {
          // Extract path information
          const urlObj = new URL(file.fileUrl);
          const pathParts = urlObj.pathname.split('/');
          
          // Find 'public' and the following bucket name in the path
          const publicIndex = pathParts.findIndex(part => part === 'public');
          
          if (publicIndex >= 0 && publicIndex + 1 < pathParts.length) {
            const bucketName = pathParts[publicIndex + 1];
            
            // Look for the old entity ID in the path
            const pathAfterBucket = pathParts.slice(publicIndex + 2).join('/');
            
            // Attempt to identify the folder structure
            let oldPath = '';
            let newPath = '';
            
            if (pathAfterBucket.includes('catering_order')) {
              // Handle catering_order path format
              const parts = pathAfterBucket.split('/');
              for (let i = 0; i < parts.length - 1; i++) {
                if (parts[i] === 'catering_order' && i + 1 < parts.length) {
                  const folderName = parts[i + 1];
                  if (folderName.includes(oldEntityId) || folderName === oldEntityId) {
                    // Found the folder with old ID
                    const fileName = parts[parts.length - 1];
                    oldPath = `catering_order/${folderName}/${fileName}`;
                    newPath = `catering_order/${newEntityId}/${fileName}`;
                    break;
                  }
                }
              }
            } else if (pathAfterBucket.includes('orders/catering')) {
              // Handle orders/catering path format
              const parts = pathAfterBucket.split('/');
              for (let i = 0; i < parts.length - 1; i++) {
                if ((parts[i] === 'orders' && parts[i+1] === 'catering') && i + 2 < parts.length) {
                  const folderName = parts[i + 2];
                  if (folderName.includes(oldEntityId) || folderName === oldEntityId) {
                    // Found the folder with old ID
                    const fileName = parts[parts.length - 1];
                    oldPath = `orders/catering/${folderName}/${fileName}`;
                    newPath = `orders/catering/${newEntityId}/${fileName}`;
                    break;
                  }
                }
              }
            }
            
            if (oldPath && newPath) {
              console.log(`Attempting to move file from ${oldPath} to ${newPath} in bucket ${bucketName}`);
              
              try {
                const { error: moveError } = await supabase.storage
                  .from(bucketName)
                  .move(oldPath, newPath);
                  
                if (moveError) {
                  console.error(`Error moving file: ${moveError.message}`);
                } else {
                  console.log(`Successfully moved file to ${newPath}`);
                  
                  // Update file URL in database
                  const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(newPath);
                  
                  await prisma.fileUpload.update({
                    where: { id: file.id },
                    data: { fileUrl: publicUrl }
                  });
                  
                  console.log(`Updated file URL to ${publicUrl}`);
                }
              } catch (moveError) {
                console.error(`Exception moving file: ${moveError}`);
              }
            } else {
              console.log(`Could not determine proper path mapping for ${file.fileUrl}`);
            }
          }
        }
        
        updatedCount++;
      } catch (error) {
        console.error(`Error updating file ${file.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully updated ${updatedCount} files from entity ${oldEntityId} to ${newEntityId}`,
    });
  } catch (error) {
    console.error("Error updating file entity IDs:", error);
    return NextResponse.json(
      { error: "Failed to update file entity IDs" },
      { status: 500 },
    );
  }
}
