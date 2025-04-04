// src/app/actions/delete-user-files.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";

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
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Fetch all files associated with the user
    const userFiles = await prisma.fileUpload.findMany({
      where: {
        userId: userId,
      },
    });

    console.log(`Found ${userFiles.length} files for user ${userId}`);

    for (const file of userFiles) {
      try {
        // Extract the file path from the URL using regex
        const fileUrlMatch = file.fileUrl.match(/fileUploader\/([^?#]+)/);
        const filePath = fileUrlMatch?.[1];
        
        if (!filePath) {
          console.error(`Could not determine file path from URL: ${file.fileUrl}`);
          errors.push(`Could not determine file path for ${file.id}`);
          // Continue with database deletion anyway
        } else {
          // Delete file from Supabase Storage
          try {
            console.log(`Attempting to delete file from Supabase Storage: ${filePath}`);
            const { data, error } = await supabase.storage
              .from("fileUploader")
              .remove([filePath]);

            if (error) {
              console.error(`Error deleting from Supabase Storage for file ${file.id}:`, error);
              errors.push(`Failed to delete file ${file.id} from storage: ${error.message}`);
              // Continue with database deletion anyway
            } else {
              console.log(`Supabase Storage delete result for ${file.id}:`, data);
            }
          } catch (storageError) {
            console.error(`Error calling Supabase Storage API for file ${file.id}:`, storageError);
            errors.push(`Failed to delete file ${file.id} from storage: ${storageError instanceof Error ? storageError.message : String(storageError)}`);
            // Continue with database deletion anyway
          }
        }

        // Delete file record from database
        await prisma.fileUpload.delete({
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

    // Revalidate any relevant paths
    try {
      revalidatePath(`/user/${userId}`);
    } catch (revalidateError) {
      console.error("Error revalidating path:", revalidateError);
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