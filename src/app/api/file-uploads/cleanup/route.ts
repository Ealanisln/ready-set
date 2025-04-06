import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: NextRequest) {
  try {
    const { fileKeys, entityId, entityType } = await request.json();

    if (!fileKeys && !entityId) {
      return NextResponse.json(
        { error: "File keys or entity ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: No active session" },
        { status: 401 },
      );
    }

    console.log("Cleanup request received:", {
      fileKeys: Array.isArray(fileKeys) ? fileKeys.length : "none",
      entityId,
      entityType,
      userId: session.user.id,
    });

    // Check if this entityId is associated with an actual order already
    if (entityId) {
      // Check if this is a catering request
      if (entityType === "catering_request") {
        const numericId = parseInt(entityId);
        if (!isNaN(numericId)) {
          // Check if a catering request with this ID exists
          const existingOrder = await prisma.cateringRequest.findUnique({
            where: {
              id: numericId.toString()
            },
            select: {
              id: true,
            },
          });

          if (existingOrder) {
            console.log(
              `Cleanup canceled: entityId ${entityId} belongs to an existing order`,
            );
            return NextResponse.json({
              success: false,
              message: "Cleanup canceled: Files belong to an existing order",
              deletedCount: 0,
            });
          }
        }
      }

      // Check if this is an on-demand request
      if (entityType === "on_demand") {
        const numericId = parseInt(entityId);
        if (!isNaN(numericId)) {
          // Check if an on_demand order with this ID exists
          const existingOrder = await prisma.onDemand.findUnique({
            where: {
              id: numericId.toString()
            },
            select: {
              id: true,
            },
          });

          if (existingOrder) {
            console.log(
              `Cleanup canceled: entityId ${entityId} belongs to an existing order`,
            );
            return NextResponse.json({
              success: false,
              message: "Cleanup canceled: Files belong to an existing order",
              deletedCount: 0,
            });
          }
        }
      }
    }

    // If fileKeys are provided, delete specific files
    if (Array.isArray(fileKeys) && fileKeys.length > 0) {
      // Additional safety check for fileKeys: don't delete files that belong to orders
      const safeToDeleteFiles = await prisma.fileUpload.findMany({
        where: {
          id: {
            in: fileKeys,
          },
          userId: session.user.id, // Security check - only delete own files
          // Don't delete files linked to real orders
          cateringRequestId: null,
          onDemandId: null,
        },
        select: {
          id: true,
          fileUrl: true,
        },
      });

      const safeToDeleteIds = safeToDeleteFiles.map((file) => file.id);

      if (safeToDeleteIds.length < fileKeys.length) {
        console.log(
          `Safety check: ${fileKeys.length - safeToDeleteIds.length} files skipped because they're linked to orders`,
        );
      }

      if (safeToDeleteIds.length === 0) {
        console.log("No files safe to delete - they may be linked to orders");
        return NextResponse.json({
          success: false,
          message: "No files were deleted - they may be linked to orders",
          deletedCount: 0,
        });
      }

      // Extract file paths from URLs
      const filePaths = safeToDeleteFiles
        .map((record) => {
          // Extract the path after "fileUploader/"
          const match = record.fileUrl.match(/fileUploader\/(.+)/);
          return match ? match[1] : null;
        })
        .filter((path): path is string => path !== null);

      console.log("Files to delete from storage:", filePaths);

      // Step 2: Delete files from Supabase storage
      if (filePaths.length > 0) {
        const { error } = await supabase.storage
          .from("fileUploader")
          .remove(filePaths);

        if (error) {
          console.error("Error deleting files from storage:", error);
          // Continue to database deletion even if storage deletion fails
        }
      }

      // Step 3: Delete records from the database
      await prisma.fileUpload.deleteMany({
        where: {
          id: {
            in: safeToDeleteIds,
          },
          userId: session.user.id, // Security check - only delete own files
        },
      });

      return NextResponse.json({
        success: true,
        deletedCount: safeToDeleteIds.length,
        message: `Successfully deleted ${safeToDeleteIds.length} files`,
      });
    }

    // If entityId is provided, delete all files for that entity
    if (entityId) {
      // Step 1: Get file records for the entity
      const fileRecords = await prisma.fileUpload.findMany({
        where: {
          userId: session.user.id,
          cateringRequestId: null,
          onDemandId: null
        },
        select: {
          id: true,
          fileUrl: true,
        },
      });

      // Extract file paths from URLs
      const filePaths = fileRecords
        .map((record) => {
          // Extract the path after "fileUploader/"
          const match = record.fileUrl.match(/fileUploader\/(.+)/);
          return match ? match[1] : null;
        })
        .filter((path): path is string => path !== null);

      console.log(
        `Found ${fileRecords.length} files to clean up for entity ${entityId}`,
      );

      if (fileRecords.length === 0) {
        return NextResponse.json({
          success: true,
          message: "No files found to clean up",
          deletedCount: 0,
        });
      }

      // Step 2: Delete files from Supabase storage
      if (filePaths.length > 0) {
        const { error } = await supabase.storage
          .from("fileUploader")
          .remove(filePaths);

        if (error) {
          console.error("Error deleting files from storage:", error);
          // Continue to database deletion even if storage deletion fails
        }
      }

      // Step 3: Delete records from the database
      await prisma.fileUpload.deleteMany({
        where: {
          userId: session.user.id,
          cateringRequestId: null,
          onDemandId: null
        }
      });

      return NextResponse.json({
        success: true,
        deletedCount: fileRecords.length,
        message: `Cleaned up ${fileRecords.length} files for entity ${entityId}`,
      });
    }

    // If we get here, no action was taken
    return NextResponse.json({ success: false, message: "No action taken" });
  } catch (error) {
    console.error("Error in file cleanup:", error);
    return NextResponse.json(
      { error: "Failed to clean up files" },
      { status: 500 },
    );
  }
}
