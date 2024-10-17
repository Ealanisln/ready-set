// src/app/actions/delete-file.ts

"use server";

import { UTApi } from "uploadthing/server";
import { PrismaClient } from "@prisma/client";
import { UploadedFile } from "@/types/upload";

const utapi = new UTApi();
const prisma = new PrismaClient();

type DeleteFileResult =
  | { success: true; message: string }
  | { success: false; message: string; error?: string };

  type UploadFileResult =
  | { success: true; files: UploadedFile[] }
  | { success: false; message: string; error?: string };

 
export const deleteFile = async (
  userId: string,
  fileKey: string,
): Promise<DeleteFileResult> => {
  console.log(
    `Attempting to delete file with key: ${fileKey} for user: ${userId}`,
  );

  try {
    const file = await prisma.file_upload.findFirst({
      where: {
        id: fileKey,
        userId: userId,
      },
    });

    if (!file) {
      console.log(`File not found in database: ${fileKey}`);
      return { success: false, message: "File not found in database" };
    }

    console.log(`File found in database: ${JSON.stringify(file)}`);

    const urlParts = file.fileUrl.split("/");
    const actualFileName = urlParts[urlParts.length - 1];
    console.log(`Extracted file name from URL: ${actualFileName}`);

    try {
      console.log(
        `Attempting to delete file from UploadThing: ${actualFileName}`,
      );
      const utResult = await utapi.deleteFiles([actualFileName]);
      console.log(`UploadThing deletion result:`, utResult);

      if (!utResult.success || utResult.deletedCount === 0) {
        console.log(
          `UploadThing couldn't delete the file. It might have already been removed or the file name doesn't match.`,
        );
      }
    } catch (utError) {
      console.error("Error calling UploadThing API:", utError);
    }

    try {
      console.log(`Attempting to delete file record from database: ${fileKey}`);
      await prisma.file_upload.delete({
        where: {
          id: fileKey,
        },
      });
      console.log(`File record deleted from database: ${fileKey}`);
    } catch (dbError) {
      console.error("Error deleting file record from database:", dbError);
      return {
        success: false,
        message: "Failed to delete file record from database",
        error: dbError instanceof Error ? dbError.message : String(dbError),
      };
    }

    return {
      success: true,
      message:
        "File record deleted from database. Note: The file may or may not have been removed from the server.",
    };
  } catch (error) {
    console.error("Unexpected error in deleteFile:", error);
    return {
      success: false,
      message: "An unexpected error occurred while deleting the file",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
