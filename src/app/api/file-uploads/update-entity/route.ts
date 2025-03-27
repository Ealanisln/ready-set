import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";

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

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: No active session" },
        { status: 401 },
      );
    }

    console.log("Update entity request:", {
      oldEntityId,
      newEntityId,
      entityType,
      userId: session.user.id,
    });

    // First, try to handle the temporary entity ID update

    // Check if there are files with the old entityId
    const fileRecords = await prisma.file_upload.findMany({
      where: {
        entityId: oldEntityId,
        entityType: entityType || undefined,
        userId: session.user.id, // Security check - only update own files
      },
      select: {
        id: true,
        fileUrl: true,
      },
    });

    console.log(
      `Found ${fileRecords.length} files to update from ${oldEntityId} to ${newEntityId}`,
    );

    if (fileRecords.length === 0) {
      // If no files found with old entityId, try looking for files with the new entityId
      // This handles the case where files may have already been associated with the new ID
      const newIdFileRecords = await prisma.file_upload.findMany({
        where: {
          entityId: newEntityId,
          entityType: entityType || undefined,
          userId: session.user.id,
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

    // Update all matching file records
    const updateResult = await prisma.file_upload.updateMany({
      where: {
        entityId: oldEntityId,
        entityType: entityType || undefined,
        userId: session.user.id, // Security check - only update own files
      },
      data: {
        entityId: newEntityId,
      },
    });

    // If this is a catering request, also update the cateringRequestId field
    if (entityType === "catering_request") {
      try {
        const newIdNumeric = parseInt(newEntityId);

        if (!isNaN(newIdNumeric)) {
          await prisma.file_upload.updateMany({
            where: {
              entityId: newEntityId,
              entityType: "catering_request",
              userId: session.user.id,
            },
            data: {
              cateringRequestId: newIdNumeric,
            },
          });
          console.log(`Updated cateringRequestId to ${newIdNumeric} for files`);
        }
      } catch (error) {
        console.error("Error updating cateringRequestId:", error);
        // Continue execution even if this fails
      }
    }

    // If this is an on_demand request, also update the onDemandId field
    if (entityType === "on_demand") {
      try {
        const newIdNumeric = parseInt(newEntityId);

        if (!isNaN(newIdNumeric)) {
          await prisma.file_upload.updateMany({
            where: {
              entityId: newEntityId,
              entityType: "on_demand",
              userId: session.user.id,
            },
            data: {
              onDemandId: newIdNumeric,
            },
          });
          console.log(`Updated onDemandId to ${newIdNumeric} for files`);
        }
      } catch (error) {
        console.error("Error updating onDemandId:", error);
        // Continue execution even if this fails
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount: updateResult.count,
      message: `Successfully updated ${updateResult.count} files from entity ${oldEntityId} to ${newEntityId}`,
    });
  } catch (error) {
    console.error("Error updating file entity IDs:", error);
    return NextResponse.json(
      { error: "Failed to update file entity IDs" },
      { status: 500 },
    );
  }
}
