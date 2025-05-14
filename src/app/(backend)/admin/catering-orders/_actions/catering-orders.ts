'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';
import {
  ClientListItem,
  ActionError,
  createCateringOrderSchema,
  CreateCateringOrderInput,
  CreateOrderResult
} from './schemas';
import { createClient } from '@/utils/supabase/server';

// Define UserType enum locally to match schema
enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  DRIVER = 'DRIVER'
}

// Define the delete operation result interface
export interface DeleteOrderResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Fetches a list of potential clients (Profiles).
 */
export async function getClients(): Promise<ClientListItem[] | ActionError> {
  try {
    const clients = await prisma.profile.findMany({
      where: {
        type: 'CLIENT',
        name: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return clients as ClientListItem[];
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { error: "Database error: Failed to fetch clients." };
  }
}

/**
 * Creates a new CateringRequest order.
 */
export async function createCateringOrder(formData: CreateCateringOrderInput): Promise<CreateOrderResult> {
  console.log("=== SERVER ACTION: createCateringOrder called ===");
  console.log("Received data:", JSON.stringify(formData, null, 2));
  
  // 1. Validate the input data
  const validationResult = createCateringOrderSchema.safeParse(formData);
  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.format());
    return {
      success: false,
      error: "Validation failed. Please check the form fields.",
      fieldErrors: validationResult.error.format(),
    };
  }

  console.log("Validation passed successfully");
  const data = validationResult.data;

  // Generate a unique order number using UUID
  const orderNumber = data.orderNumber || `CATER-${uuidv4()}`;
  console.log(`Attempting to create order with orderNumber: ${orderNumber}`);

  // Get Supabase client for session information and file operations
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Extract temp entity ID from form data if it exists
  // This is the temp ID used for file uploads before the order was created
  const tempEntityId = data.tempEntityId || null;
  
  try {
    // 2. Perform database operations within a transaction
    console.log("Starting database transaction");
    const newOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create pickup address
      console.log("Creating pickup address");
      const pickupAddress = await tx.address.create({
        data: data.pickupAddress,
      });
      console.log("Pickup address created:", pickupAddress.id);
      
      // Create delivery address
      console.log("Creating delivery address");
      const deliveryAddress = await tx.address.create({
        data: data.deliveryAddress,
      });
      console.log("Delivery address created:", deliveryAddress.id);

      // Create the CateringRequest
      console.log("Creating catering request record");
      const order = await tx.cateringRequest.create({
        data: {
          userId: data.userId,
          orderNumber: orderNumber,
          brokerage: data.brokerage,
          status: 'ACTIVE',
          pickupDateTime: data.pickupDateTime,
          arrivalDateTime: data.arrivalDateTime,
          completeDateTime: data.completeDateTime,
          headcount: data.headcount,
          needHost: data.needHost,
          hoursNeeded: data.hoursNeeded,
          numberOfHosts: data.numberOfHosts,
          clientAttention: data.clientAttention,
          pickupNotes: data.pickupNotes,
          specialNotes: data.specialNotes,
          orderTotal: data.orderTotal,
          tip: data.tip,
          pickupAddressId: pickupAddress.id,
          deliveryAddressId: deliveryAddress.id,
        },
      });
      console.log("Catering request created:", order.id);
      return order;
    });

    console.log("Transaction completed successfully");
    
    // 3. Update any temporary file associations
    if (tempEntityId && user) {
      try {
        console.log(`Attempting to update file associations from temp ID ${tempEntityId} to order ID ${newOrder.id}`);
        
        // Call the API to update file associations
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ready-set.vercel.app';
        const updateUrl = `${baseUrl}/api/file-uploads/update-entity`;
        console.log(`Calling update-entity API at: ${updateUrl}`);
        
        const updateData = {
          oldEntityId: tempEntityId,
          newEntityId: newOrder.id,
          entityType: 'catering_request',
        };
        console.log('Update file entity request data:', JSON.stringify(updateData));
        
        const response = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('File associations update successful:', result);
        } else {
          const errorText = await response.text();
          console.error(`Failed to update file associations: ${response.status} - ${errorText}`);
          
          // Add retry logic in case of failure
          console.log('Retrying file association update with a slight delay...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const retryResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });
          
          if (retryResponse.ok) {
            const retryResult = await retryResponse.json();
            console.log('File associations update retry successful:', retryResult);
          } else {
            console.error('Retry failed to update file associations:', await retryResponse.text());
          }
        }
      } catch (error) {
        // Log but don't fail the order creation if file update fails
        console.error('Error updating file associations:', error);
        
        // Make sure we have enough details for debugging
        if (error instanceof Error) {
          console.error(`Error stack: ${error.stack}`);
        }
      }

      // Also try to update storage paths for any temporary files
      try {
        console.log(`Attempting to update storage paths for temp files`);
        
        // Format the tempEntityId to ensure consistency
        const formattedTempId = tempEntityId.startsWith('temp-') 
          ? tempEntityId 
          : `temp-${tempEntityId}`;
          
        console.log(`Checking for files with formatted temp ID: ${formattedTempId}`);
        
        const supabase = await createClient();
        
        // Try multiple possible paths for temp files
        const possibleTempPaths = [
          `catering_order/${formattedTempId}`,
          `orders/catering/${formattedTempId}`, 
          `catering_order/temp-${tempEntityId}`,
          `orders/catering/temp-${tempEntityId}`
        ];
        
        let foundFiles = false;
        
        // First check for files in the possible temp paths
        for (const tempPath of possibleTempPaths) {
          console.log(`Checking for files in path: ${tempPath}`);
          
          const { data: tempFiles, error: listError } = await supabase.storage
            .from('fileUploader')
            .list(tempPath);
          
          if (listError) {
            console.log(`Error listing files in ${tempPath}:`, listError);
            continue; // Try next path
          }
          
          if (tempFiles && tempFiles.length > 0) {
            console.log(`Found ${tempFiles.length} temp files in ${tempPath} to move to permanent location`);
            foundFiles = true;
            
            // Move each file to the new path
            for (const file of tempFiles) {
              const oldPath = `${tempPath}/${file.name}`;
              const newPath = `catering_order/${newOrder.id}/${file.name}`;
              
              console.log(`Moving file from ${oldPath} to ${newPath}`);
              
              try {
                const { error: moveError } = await supabase.storage
                  .from('fileUploader')
                  .move(oldPath, newPath);
                  
                if (moveError) {
                  console.error(`Error moving file ${oldPath} to ${newPath}:`, moveError);
                } else {
                  console.log(`Successfully moved file from ${oldPath} to ${newPath}`);
                  
                  // Update file URL in database if needed
                  const { data: { publicUrl } } = supabase.storage
                    .from('fileUploader')
                    .getPublicUrl(newPath);
                    
                  try {
                    // Update the file record in the database with the new URL
                    await prisma.fileUpload.updateMany({
                      where: {
                        fileUrl: {
                          contains: oldPath
                        },
                        isTemporary: true
                      },
                      data: {
                        fileUrl: publicUrl,
                        isTemporary: false,
                        cateringRequestId: newOrder.id
                      }
                    });
                    
                    console.log(`Updated file URL in database for ${oldPath} to ${publicUrl}`);
                  } catch (dbError) {
                    console.error('Error updating file URL in database:', dbError);
                  }
                }
              } catch (moveError) {
                console.error(`Exception moving file ${oldPath} to ${newPath}:`, moveError);
              }
            }
          } else {
            console.log(`No temp files found in ${tempPath}`);
          }
        }
        
        // If we didn't find any files by path, check the database for files with encoded category
        if (!foundFiles) {
          console.log("Checking database for files with encoded category");
          
          // Look for files with the temp ID encoded in the category field
          const encodedTempFiles = await prisma.fileUpload.findMany({
            where: {
              isTemporary: true,
              OR: [
                { category: { contains: formattedTempId } },
                { category: { contains: tempEntityId } }
              ]
            }
          });
          
          if (encodedTempFiles.length > 0) {
            console.log(`Found ${encodedTempFiles.length} files with encoded temp ID in category`);
            
            // Update them to use the new order ID
            for (const file of encodedTempFiles) {
              try {
                await prisma.fileUpload.update({
                  where: { id: file.id },
                  data: {
                    isTemporary: false,
                    cateringRequestId: newOrder.id,
                    category: "catering-order"
                  }
                });
                
                console.log(`Updated file record ${file.id} with new order ID ${newOrder.id}`);
                
                // If the file has a URL that contains the temp ID, try to move it
                if (file.fileUrl && (file.fileUrl.includes(formattedTempId) || file.fileUrl.includes(tempEntityId))) {
                  const url = new URL(file.fileUrl);
                  const parts = url.pathname.split('/');
                  let tempPath = '';
                  let fileName = '';
                  
                  // Try to extract the path and filename
                  const publicIndex = parts.findIndex(part => part === 'public');
                  if (publicIndex >= 0 && publicIndex + 2 < parts.length) {
                    const bucketName = parts[publicIndex + 1];
                    const pathParts = parts.slice(publicIndex + 2);
                    fileName = pathParts[pathParts.length - 1];
                    tempPath = pathParts.slice(0, -1).join('/');
                    
                    if (tempPath && fileName) {
                      const oldPath = `${tempPath}/${fileName}`;
                      const newPath = `catering_order/${newOrder.id}/${fileName}`;
                      
                      console.log(`Moving file from ${oldPath} to ${newPath}`);
                      
                      try {
                        const { error: moveError } = await supabase.storage
                          .from(bucketName)
                          .move(oldPath, newPath);
                          
                        if (!moveError) {
                          // Update URL in database
                          const { data: { publicUrl } } = supabase.storage
                            .from(bucketName)
                            .getPublicUrl(newPath);
                            
                          await prisma.fileUpload.update({
                            where: { id: file.id },
                            data: { fileUrl: publicUrl }
                          });
                          
                          console.log(`Updated file URL for ${file.id} to ${publicUrl}`);
                        } else {
                          console.error(`Error moving file: ${moveError.message}`);
                        }
                      } catch (moveError) {
                        console.error('Error moving file:', moveError);
                      }
                    }
                  }
                }
              } catch (updateError) {
                console.error(`Error updating file ${file.id}:`, updateError);
              }
            }
          } else {
            console.log("No files found with encoded temp ID in category");
          }
        }
      } catch (storageError) {
        console.error('Error updating storage paths:', storageError);
      }
    }

    // 4. Revalidate relevant paths
    revalidatePath('/admin/catering-orders');
    revalidatePath('/(api)/orders/catering-orders'); // Example: Revalidate an API route if needed

    // 5. Return success result
    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
    };

  } catch (error) {
    console.error("Failed to create catering order:", error);
    
    // Print the full error details
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Unknown error type:", error);
    }
    
    // Check if the error is a Prisma unique constraint violation on orderNumber
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      // Assuming the unique constraint is on 'orderNumber'. Adjust field name if different.
      const targetFields = error.meta?.target as string[] | undefined;
      if (targetFields?.includes('orderNumber')) {
        return {
          success: false,
          error: `Order number '${orderNumber}' already exists. Please use a unique order number.`,
          fieldErrors: { 
            orderNumber: { _errors: [`Order number '${orderNumber}' already exists.`] },
            _errors: [] // Add top-level _errors array
           } 
        };
      }
    }

    // Generic database error
    return {
      success: false,
      error: "Database error: Failed to create catering order.",
    };
  }
}

/**
 * Deletes a CateringRequest order.
 * Only ADMIN and SUPER_ADMIN users can delete orders.
 */
export async function deleteCateringOrder(orderId: string): Promise<DeleteOrderResult> {
  console.log("=== SERVER ACTION: deleteCateringOrder called ===");
  console.log(`Attempting to delete order with ID: ${orderId}`);

  try {
    // Get authenticated user from Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      console.error("Unauthorized: No authenticated user");
      return { success: false, error: "Unauthorized: You must be logged in to perform this action." };
    }

    // Check if the user is an ADMIN or SUPER_ADMIN
    const userProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { type: true }
    });

    if (!userProfile || (userProfile.type !== UserType.ADMIN && userProfile.type !== UserType.SUPER_ADMIN)) {
      console.error(`Unauthorized: User ${user.id} with type ${userProfile?.type} attempted to delete order`);
      return { 
        success: false, 
        error: "Unauthorized: Only Admin or Super Admin can delete catering orders." 
      };
    }

    // Find the order first to make sure it exists
    const order = await prisma.cateringRequest.findUnique({
      where: { id: orderId },
      include: {
        fileUploads: true
      }
    });

    if (!order) {
      return { success: false, error: `Order with ID ${orderId} not found.` };
    }

    // Get file uploads before transaction to ensure we have them for storage deletion
    const fileUploads = [...order.fileUploads];

    // Perform the deletion in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete associated dispatches
      await tx.dispatch.deleteMany({
        where: { cateringRequestId: orderId }
      });

      // Delete associated file uploads from database
      await tx.fileUpload.deleteMany({
        where: { cateringRequestId: orderId }
      });

      // Delete the order
      await tx.cateringRequest.delete({
        where: { id: orderId }
      });
    });

    // Delete files from storage bucket (outside transaction since it's an external service)
    if (fileUploads.length > 0) {
      for (const file of fileUploads) {
        if (file.fileUrl) {
          try {
            console.log(`Processing file URL for deletion: ${file.fileUrl}`);
            
            // Extract the storage URL parts
            let bucketName = "fileUploader"; // Default bucket name
            let filePath = "";
            let tempFolderPath = "";
            
            // Look for patterns in the URL
            // 1. Check standard format: .../storage/v1/object/public/bucket-name/path
            const standardPattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+?)(?:\?.*)?$/;
            const standardMatch = file.fileUrl.match(standardPattern);
            
            // 2. Check for temp folder pattern: .../temp-[UUID]/...
            const tempFolderPattern = /(temp-[a-zA-Z0-9]+)/;
            const tempFolderMatch = file.fileUrl.match(tempFolderPattern);
            
            if (standardMatch) {
              // Standard URL format
              bucketName = standardMatch[1];
              filePath = standardMatch[2];
              console.log(`Standard URL pattern detected: bucket=${bucketName}, path=${filePath}`);

              // Attempt to delete from standard path
              const { error } = await supabase.storage.from(bucketName).remove([filePath]);
              if (error) {
                console.error(`Error deleting file from standard path:`, error);
              } else {
                console.log(`Successfully deleted file from standard path`);
              }
            } 
            else if (tempFolderMatch) {
              // This is a temp folder structure
              tempFolderPath = tempFolderMatch[1];
              bucketName = "fileUploader"; // Most likely bucket for temp uploads
              
              console.log(`Temp folder detected: ${tempFolderPath}`);

              // Try several possible path structures
              const pathAttempts = [];
              
              // 1. First attempt: Get everything after the domain including temp folder
              const url = new URL(file.fileUrl);
              const fullPath = url.pathname.split('/').slice(1).join('/');
              pathAttempts.push(fullPath);
              
              // 2. Just the temp folder name
              pathAttempts.push(tempFolderPath);
              
              // 3. Try with the file name if we can extract it
              const pathParts = url.pathname.split('/');
              const fileName = pathParts[pathParts.length - 1];
              if (fileName && !fileName.startsWith('temp-')) {
                pathAttempts.push(`${tempFolderPath}/${fileName}`);
              }
              
              // 4. Look for catering_order subfolder from the screenshot
              if (url.pathname.includes('catering_order')) {
                pathAttempts.push(`${tempFolderPath}/catering_order/${fileName}`);
              }
              
              // Try all path combinations
              let deleteSuccess = false;
              for (const attemptPath of pathAttempts) {
                if (!attemptPath) continue;
                
                console.log(`Attempting to delete: bucket=${bucketName}, path=${attemptPath}`);
                const { error } = await supabase.storage.from(bucketName).remove([attemptPath]);
                
                if (!error) {
                  console.log(`Successfully deleted file using path: ${attemptPath}`);
                  deleteSuccess = true;
                  break;
                } else {
                  console.log(`Failed with path ${attemptPath}: ${error.message}`);
                }
              }
              
              if (!deleteSuccess) {
                console.error(`Failed to delete file after trying multiple paths`);
              }
            } 
            else {
              // Fallback method
              console.log(`No recognized pattern, using fallback method`);
              try {
                const url = new URL(file.fileUrl);
                filePath = url.pathname.split('/').slice(1).join('/');
                console.log(`Fallback: bucket=${bucketName}, path=${filePath}`);
                
                const { error } = await supabase.storage.from(bucketName).remove([filePath]);
                if (error) {
                  console.error(`Error with fallback path:`, error);
                } else {
                  console.log(`Successfully deleted file using fallback path`);
                }
              } catch (e) {
                console.error(`Fallback method failed:`, e);
              }
            }
          } catch (error) {
            console.error(`Error processing file URL ${file.fileUrl}:`, error);
          }
        }
      }
    }

    // Revalidate relevant paths
    revalidatePath('/admin/catering-orders');
    revalidatePath(`/admin/catering-orders/${order.orderNumber}`);
    
    return { 
      success: true,
      message: "Order and associated data deleted successfully" 
    };
  } catch (error) {
    console.error("Failed to delete catering order:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    
    return {
      success: false,
      error: "Database error: Failed to delete catering order."
    };
  }
}

// --- Create Order Action (will be added next) --- 