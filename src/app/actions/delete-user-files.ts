// src/app/actions/delete-user-files.ts

"use server";

import { UTApi } from "uploadthing/server";
import { PrismaClient } from "@prisma/client";

const utapi = new UTApi();
const prisma = new PrismaClient();

type DeleteUserFilesResult = {
  success: boolean;
  message: string;
  deletedCount: number;
  errors: string[];
};

export const deleteUserFiles = async (userId: string): Promise<DeleteUserFilesResult> => {
  console.log(`Attempting to delete all files for user: ${userId}`);

  let deletedCount = 0;
  const errors: string[] = [];

  try {
    // Fetch all files associated with the user
    const userFiles = await prisma.file_upload.findMany({
      where: {
        userId: userId,
      },
    });

    console.log(`Found ${userFiles.length} files for user ${userId}`);

    for (const file of userFiles) {
      try {
        const urlParts = file.fileUrl.split("/");
        const actualFileName = urlParts[urlParts.length - 1];
        console.log(`Processing file: ${actualFileName}`);

        // Delete file from UploadThing
        try {
          const utResult = await utapi.deleteFiles([actualFileName]);
          console.log(`UploadThing deletion result for ${actualFileName}:`, utResult);

          if (!utResult.success || utResult.deletedCount === 0) {
            console.log(`UploadThing couldn't delete the file ${actualFileName}. It might have already been removed or the file name doesn't match.`);
          }
        } catch (utError) {
          console.error(`Error calling UploadThing API for file ${actualFileName}:`, utError);
          errors.push(`Failed to delete file ${actualFileName} from storage: ${utError instanceof Error ? utError.message : String(utError)}`);
        }

        // Delete file record from database
        await prisma.file_upload.delete({
          where: {
            id: file.id,
          },
        });
        console.log(`File record deleted from database: ${file.id}`);

        deletedCount++;
      } catch (fileError) {
        console.error(`Error processing file ${file.id}:`, fileError);
        errors.push(`Failed to process file ${file.id}: ${fileError instanceof Error ? fileError.message : String(fileError)}`);
      }
    }

    const message = deletedCount > 0
      ? `Successfully deleted ${deletedCount} files for user ${userId}`
      : `No files were deleted for user ${userId}`;

    return {
      success: true,
      message,
      deletedCount,
      errors,
    };
  } catch (error) {
    console.error("Unexpected error in deleteUserFiles:", error);
    return {
      success: false,
      message: "An unexpected error occurred while deleting user files",
      deletedCount,
      errors: [...errors, error instanceof Error ? error.message : String(error)],
    };
  }
};