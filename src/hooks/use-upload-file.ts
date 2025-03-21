// src/hooks/use-upload-file.ts
import { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { SupabaseClient } from "@supabase/supabase-js";
import { FileWithPath } from "react-dropzone";
import toast from "react-hot-toast";

export type UploadedFile = {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
  entityId?: string;
  category?: string;
  path?: string;
  bucketName?: string;
};

interface UseUploadFileOptions {
  defaultUploadedFiles?: UploadedFile[];
  bucketName?: string;
  maxFileCount?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  entityType?: string;
  userId?: string;
  entityId?: string;
  category?: string;
}

export function useUploadFile({
  bucketName = "fileUploader",
  defaultUploadedFiles = [],
  maxFileCount = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB by default
  allowedFileTypes = [],
  entityType,
  userId,
  entityId: initialEntityId,
  category,
}: UseUploadFileOptions = {}) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(defaultUploadedFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [tempEntityId, setTempEntityId] = useState<string>(
    initialEntityId || uuidv4(),
  );

  // Initialize Supabase client if not already initialized
  const initSupabase = useCallback(async () => {
    if (!supabase) {
      try {
        const client = await createClient();
        setSupabase(client);
        return client;
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        toast.error("Error connecting to storage service. Please try again.");
        return null;
      }
    }
    return supabase;
  }, [supabase]);

  // Handle file uploads to Supabase Storage and register in database via API
  const onUpload = useCallback(
    async (files: FileWithPath[]): Promise<UploadedFile[]> => {
      setIsUploading(true);
      const newProgresses = { ...progresses };
      const uploadResults: UploadedFile[] = [];

      try {
        // Validate file count
        if (uploadedFiles.length + files.length > maxFileCount) {
          toast.error(`You can only upload up to ${maxFileCount} files`);
          throw new Error(`You can only upload up to ${maxFileCount} files`);
        }

        // Process each file using FormData and the API route
        for (const file of files) {
          // Validate file size
          if (file.size > maxFileSize) {
            const maxSizeMB = maxFileSize / 1024 / 1024;
            toast.error(
              `File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`,
            );
            continue; // Skip this file but try to process others
          }

          // Validate file type if restrictions exist
          if (
            allowedFileTypes.length > 0 &&
            !allowedFileTypes.includes(file.type)
          ) {
            toast.error(`File type ${file.type} is not allowed`);
            continue; // Skip this file but try to process others
          }

          // Create FormData for API upload
          const formData = new FormData();
          formData.append("file", file);
          formData.append("entityId", tempEntityId || "");
          formData.append("entityType", entityType || "");
          formData.append("category", category || "general");
          formData.append("bucketName", bucketName || "fileUploader");

          newProgresses[file.name] = 10;
          setProgresses(newProgresses);

          console.log(`Uploading file ${file.name} via API`);

          // Upload file using the API route
          const response = await fetch("/api/file-uploads", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error uploading ${file.name}:`, errorData);
            toast.error(
              `Error uploading ${file.name}: ${errorData.error || "Unknown error"}`,
            );
            continue; // Skip this file but try to process others
          }

          const data = await response.json();
          console.log(`Upload response for ${file.name}:`, data);

          if (data.success && data.file) {
            const uploadedFile: UploadedFile = {
              key: data.file.id,
              name: data.file.name,
              url: data.file.url,
              size: data.file.size,
              type: data.file.type,
              entityId: data.file.entityId,
              category: data.file.category,
              path: data.file.path,
              bucketName: data.file.bucketName || bucketName,
            };

            uploadResults.push(uploadedFile);
          }

          newProgresses[file.name] = 100;
          setProgresses(newProgresses);
        }

        // Only add successfully uploaded files to state
        if (uploadResults.length > 0) {
          setUploadedFiles((prev) => [...prev, ...uploadResults]);
          toast.success(
            `Successfully uploaded ${uploadResults.length} file(s)`,
          );
        }

        return uploadResults;
      } catch (error: any) {
        console.error("Error uploading files:", error);
        toast.error(`Upload error: ${error.message || "Unknown error"}`);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [
      category,
      entityType,
      maxFileCount,
      maxFileSize,
      allowedFileTypes,
      progresses,
      tempEntityId,
      uploadedFiles,
      bucketName,
    ],
  );

  // Update the entity ID for all uploaded files
  const updateEntityId = useCallback(
    async (newEntityId: string) => {
      try {
        console.log(
          `Updating entity ID from ${tempEntityId} to ${newEntityId}`,
        );

        // Make an API call to update the entity IDs
        const response = await fetch("/api/file-uploads/update-entity", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldEntityId: tempEntityId,
            newEntityId,
            entityType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update entity ID");
        }

        // Update local state
        setUploadedFiles((prev) =>
          prev.map((file) => ({
            ...file,
            entityId: newEntityId,
          })),
        );

        setTempEntityId(newEntityId);
        return true;
      } catch (error) {
        console.error("Error updating entity ID:", error);
        return false;
      }
    },
    [tempEntityId, entityType],
  );

  // Delete a file from Supabase storage and database
  // Delete a file from Supabase storage and database
  const deleteFile = useCallback(
    async (fileKey: string) => {
      try {
        console.log(`Deleting file with key: ${fileKey}`);

        // We'll use our API route to delete the file
        const response = await fetch("/api/file-uploads", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileId: fileKey,
            userId: userId || "",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete file");
        }

        // Update local state to remove the deleted file
        setUploadedFiles((prev) => prev.filter((file) => file.key !== fileKey));

        toast.success("File deleted successfully");
        return true;
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Error deleting file. Please try again.");
        throw error;
      }
    },
    [userId],
  );

  // You can also add a direct Supabase deletion method if needed, but let's keep it simpler:
  const deleteFileWithSupabase = useCallback(
    async (fileKey: string) => {
      try {
        console.log(`Deleting file with key: ${fileKey} using Supabase client`);

        // First get the file information from the API
        const infoResponse = await fetch(
          `/api/file-uploads/info?fileId=${fileKey}`,
          {
            method: "GET",
          },
        );

        if (!infoResponse.ok) {
          const errorData = await infoResponse.json();
          throw new Error(errorData.error || "Failed to get file info");
        }

        const fileInfo = await infoResponse.json();

        // Initialize Supabase client
        const client = await initSupabase();
        if (!client) {
          throw new Error("Failed to initialize Supabase client");
        }

        // Extract the file path from the URL using regex
        const fileUrlMatch = fileInfo.fileUrl.match(/fileUploader\/([^?#]+)/);
        const filePath = fileUrlMatch?.[1];

        if (!filePath) {
          throw new Error("Could not determine file path from URL");
        }

        // Delete file from Supabase Storage
        const { data, error } = await client.storage
          .from("fileUploader")
          .remove([filePath]);

        if (error) {
          console.error("Error deleting from Supabase Storage:", error);
          throw error;
        }

        // Delete the record from database
        const dbResponse = await fetch("/api/file-uploads", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileId: fileKey }),
        });

        if (!dbResponse.ok) {
          const errorData = await dbResponse.json();
          throw new Error(errorData.error || "Failed to delete file record");
        }

        // Update local state
        setUploadedFiles((prev) => prev.filter((file) => file.key !== fileKey));

        toast.success("File deleted successfully");
        return true;
      } catch (error) {
        console.error("Error deleting file with Supabase:", error);
        toast.error("Error deleting file. Please try again.");
        throw error;
      }
    },
    [initSupabase],
  );

  return {
    uploadedFiles,
    isUploading,
    progresses,
    tempEntityId,
    onUpload,
    updateEntityId,
    deleteFile,
    deleteFileWithSupabase,
  };
}
