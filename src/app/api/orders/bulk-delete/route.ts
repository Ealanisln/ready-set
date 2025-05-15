// src/app/api/your-route-path/bulk-delete-orders/route.ts
// Adjust the path above as needed

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Assumes this is your server client helper
import { prisma } from "@/utils/prismaDB";
import { storage } from "@/utils/supabase/storage"; // Import the new storage utility
import { UserType } from "@prisma/client";
import { PrismaTransaction } from "@/types/prisma-types";

// Constants
const BUCKET_NAME = "fileUploader"; // Replace with your actual bucket name

// Helper to create a Supabase client
async function getSupabaseClient() {
  return await createClient();
}

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client (for auth check primarily)
    // Note: The storage utility will create its own client instance internally
    const supabase = await getSupabaseClient();

    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { message: "Unauthorized - Must be signed in" },
        { status: 401 },
      );
    }

    // Get user profile from Prisma
    const userData = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { type: true },
    });

    // Only allow admins or super_admins
    if (
      !userData ||
      (userData.type !== UserType.ADMIN && userData.type !== UserType.SUPER_ADMIN)
    ) {
      return NextResponse.json(
        { message: "Forbidden - Admin permissions required" },
        { status: 403 },
      );
    }

    // Get order numbers from request body
    const { orderNumbers } = await req.json();

    if (!Array.isArray(orderNumbers) || orderNumbers.length === 0) {
      return NextResponse.json(
        {
          message:
            "Invalid request format. Expected an array of order numbers.",
        },
        { status: 400 },
      );
    }

    const results = {
      deleted: [] as string[],
      failed: [] as { orderNumber: string; reason: string }[],
    };

    const BUCKET_NAME = "order-files"; // Define bucket name clearly

    // Process each order
    for (const orderNumber of orderNumbers) {
      try {
        // Step 1: Identify order type and ID
        let orderType: "catering" | "on_demand" | null = null;
        let orderId: string | null = null;

        const cateringRequest = await prisma.cateringRequest.findUnique({
          where: { orderNumber: orderNumber },
          select: { id: true },
        });

        if (cateringRequest) {
          orderType = "catering";
          orderId = cateringRequest.id;
        } else {
          const onDemandOrder = await prisma.onDemand.findUnique({
            where: { orderNumber: orderNumber },
            select: { id: true },
          });
          if (onDemandOrder) {
            orderType = "on_demand";
            orderId = onDemandOrder.id;
          }
        }

        if (!orderType || !orderId) {
          results.failed.push({
            orderNumber,
            reason: "Order not found in database",
          });
          continue; // Skip to the next order number
        }

        // Step 2: Find all file uploads linked to this order
        const fileUploads = await prisma.fileUpload.findMany({
          where:
            orderType === "catering"
              ? { cateringRequestId: orderId }
              : { onDemandId: orderId },
        });

        // Step 3: Start a transaction for atomic database operations
        await prisma.$transaction(async (tx: PrismaTransaction) => {
          // Step 4: Delete associated files from Supabase Storage
          console.log(
            `Processing files for order ${orderNumber}. Found ${fileUploads.length} files.`,
          );
          for (const file of fileUploads) {
            let filePath = ""; // The path within the bucket

            // --- CRITICAL: File Path Extraction ---
            // Attempt to extract the path from a full Supabase URL.
            // Assumes URL like: https://<proj>.supabase.co/storage/v1/object/public/order-files/path/to/file.ext
            // Adjust this logic based on the EXACT format of `file.fileUrl` in your database!
            try {
              if (!file.fileUrl) {
                console.warn(
                  `File record ${file.id} for order ${orderNumber} has no fileUrl.`,
                );
                continue; // Skip if no URL
              }
              const url = new URL(file.fileUrl);
              const pathParts = url.pathname.split("/");
              // Find the index of the part *after* the bucket name
              const bucketNameIndex = pathParts.indexOf(BUCKET_NAME);

              if (
                bucketNameIndex !== -1 &&
                bucketNameIndex + 1 < pathParts.length
              ) {
                // Join all parts *after* the bucket name
                filePath = pathParts.slice(bucketNameIndex + 1).join("/");
                console.log(
                  `Extracted path: ${filePath} from URL: ${file.fileUrl}`,
                );
              } else {
                // Fallback: Maybe the stored URL *is* just the path, or only the filename?
                // Using the original regex as a less reliable fallback.
                const simpleMatch = file.fileUrl.match(/\/([^/]+)$/);
                if (simpleMatch && simpleMatch[1]) {
                  filePath = simpleMatch[1]; // WARNING: This might just be the filename!
                  console.warn(
                    `Using fallback path extraction (likely just filename): ${filePath} for URL: ${file.fileUrl}. Verify this is correct!`,
                  );
                } else {
                  console.error(
                    `Could not extract valid file path for bucket ${BUCKET_NAME} from URL: ${file.fileUrl}`,
                  );
                }
              }
            } catch (e) {
              console.error(
                `Error parsing fileUrl "${file.fileUrl}" for order ${orderNumber}:`,
                e,
              );
              // Decide if you want to continue or fail the transaction
              continue; // Skipping this file due to URL parse error
            }
            // --- End File Path Extraction ---

            if (filePath) {
              // Delete from Supabase Storage using the new utility
              try {
                console.log(
                  `Attempting to delete file from storage: ${filePath}`,
                );
                // *** Use the imported storage utility ***
                // Note: This uses the request's user context. Storage Policies MUST allow deletion.
                const bucket = await storage.from(BUCKET_NAME);
                const { error: storageError } = await bucket.remove([filePath]); // Call remove

                if (storageError) {
                  console.error(
                    `Storage Error deleting ${filePath} (Order ${orderNumber}):`,
                    storageError.message,
                  );
                  // Decide how to handle storage errors. Should it stop the whole process?
                  // Throwing an error here would rollback the Prisma transaction.
                  // For now, we log it and continue deleting DB records, leaving the file potentially orphaned.
                  // throw new Error(`Failed to delete file ${filePath} from storage: ${storageError.message}`);
                } else {
                  console.log(
                    `Successfully deleted file ${filePath} from storage (Order ${orderNumber}).`,
                  );
                }
              } catch (err) {
                // Catch errors from the storage utility call itself (e.g., network issues)
                console.error(
                  `Exception during storage deletion for ${filePath} (Order ${orderNumber}):`,
                  err,
                );
                // Again, decide if this should rollback the transaction
                // throw err;
              }
            } else {
              console.warn(
                `Skipping storage deletion for file record ${file.id} (Order ${orderNumber}) due to missing/unparsable path from URL: ${file.fileUrl}`,
              );
            }
          } // End loop through files

          // Step 5: Delete all dispatches related to the order
          console.log(
            `Deleting dispatches for order ${orderNumber} (ID: ${orderId}, Type: ${orderType})`,
          );
          await tx.dispatch.deleteMany({
            where:
              orderType === "catering"
                ? { cateringRequestId: orderId }
                : { onDemandId: orderId },
          });

          // Step 6: Delete all file upload records from the database
          console.log(`Deleting fileUpload records for order ${orderNumber}`);
          await tx.fileUpload.deleteMany({
            where:
              orderType === "catering"
                ? { cateringRequestId: orderId }
                : { onDemandId: orderId },
          });

          // Step 7: Delete the order itself
          console.log(`Deleting order record for ${orderNumber}`);
          if (orderType === "catering") {
            await tx.cateringRequest.delete({
              where: { id: orderId },
            });
          } else {
            // 'on_demand'
            await tx.onDemand.delete({
              where: { id: orderId },
            });
          }

          console.log(
            `Successfully processed database deletions within transaction for order ${orderNumber}.`,
          );
        }); // End Prisma transaction

        // If transaction was successful
        results.deleted.push(orderNumber);
        console.log(
          `Order ${orderNumber} and associated data/files marked for deletion successfully.`,
        );
      } catch (error) {
        // Catch errors during processing of a single order (including transaction failures)
        console.error(`Error processing order ${orderNumber}:`, error);
        results.failed.push({
          orderNumber,
          reason:
            error instanceof Error ? error.message : "Unknown processing error",
        });
        // Continue to the next order number even if one fails
      }
    } // End loop through orderNumbers

    console.log("Bulk deletion process completed.", results);
    return NextResponse.json({
      message: `Bulk deletion attempted. ${results.deleted.length} orders processed for deletion, ${results.failed.length} failed. Check logs and results for details.`,
      results,
    });
  } catch (error) {
    // Catch broad errors (e.g., request parsing, initial auth check)
    console.error("Fatal Error in bulk order deletion API:", error);
    return NextResponse.json(
      {
        message: "Error occurred during bulk order deletion process.",
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}
