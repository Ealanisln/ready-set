// src/app/actions/delete-file.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";

type DeleteFileResult =
  | { success: true; message: string }
  | { success: false; message: string; error?: string };

export const deleteFile = async (
  userId: string,
  fileKey: string,
): Promise<DeleteFileResult> => {
  console.log(
    `Attempting to delete file with key: ${fileKey} for user: ${userId}`,
  );

  try {
    // 1. Get the file record from the database
    const file = await prisma.fileUpload.findFirst({
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

    // 2. Extract the file path from the URL using regex like in your API route
    const fileUrlMatch = file.fileUrl.match(/fileUploader\/([^?#]+)/);
    const filePath = fileUrlMatch?.[1];

    if (!filePath) {
      console.error("Could not determine file path from URL:", file.fileUrl);
      // We'll continue to delete the database record even if we can't parse the path
    } else {
      // 3. Initialize Supabase client
      const supabase = await createClient();

      // 4. Delete the file from Supabase Storage
      try {
        console.log(`Attempting to delete file from Supabase Storage: ${filePath}`);
        const { data, error } = await supabase.storage
          .from("fileUploader")
          .remove([filePath]);

        if (error) {
          console.error("Error deleting from Supabase Storage:", error);
          // We'll continue to delete the database record even if the storage delete fails
        } else {
          console.log(`Supabase Storage delete result:`, data);
        }
      } catch (storageError) {
        console.error("Error calling Supabase Storage API:", storageError);
        // Continue with database deletion anyway
      }
    }

    // 5. Delete the database record
    try {
      console.log(`Attempting to delete file record from database: ${fileKey}`);
      await prisma.fileUpload.delete({
        where: {
          id: fileKey,
        },
      });
      console.log(`File record deleted from database: ${fileKey}`);
      
      // Optionally revalidate any paths that might show this file
      revalidatePath(`/user/${userId}`);
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
      message: "File successfully deleted from storage and database.",
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