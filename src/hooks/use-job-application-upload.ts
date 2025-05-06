import { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { SupabaseClient } from "@supabase/supabase-js";
import { FileWithPath } from "react-dropzone";
import toast from "react-hot-toast";

export interface UploadedFile {
  key: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  entityId?: string;
  category?: string;
  bucketName: string;
}

interface UseJobApplicationUploadOptions {
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

export function useJobApplicationUpload({
  bucketName = "user-assets",
  defaultUploadedFiles = [],
  maxFileCount = 1,
  maxFileSize = 5 * 1024 * 1024, // 5MB by default
  allowedFileTypes = [],
  entityType,
  userId,
  entityId: initialEntityId,
  category,
}: UseJobApplicationUploadOptions = {}) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(defaultUploadedFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [entityId, setEntityId] = useState<string>(initialEntityId || "");

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

  // Handle file uploads to Supabase Storage
  const onUpload = useCallback(
    async (files: FileWithPath[]): Promise<UploadedFile[]> => {
      // Check if we've already reached the maximum number of files
      if (uploadedFiles.length >= maxFileCount) {
        toast.error(`Maximum ${maxFileCount} file${maxFileCount > 1 ? 's' : ''} allowed`);
        return [];
      }

      // Check if adding these files would exceed the limit
      if (uploadedFiles.length + files.length > maxFileCount) {
        toast.error(`Cannot upload ${files.length} files. Maximum ${maxFileCount} file${maxFileCount > 1 ? 's' : ''} allowed`);
        return [];
      }

      setIsUploading(true);
      const newProgresses = { ...progresses };
      const uploadedFilesList: UploadedFile[] = [];

      try {
        // Create a FormData object for the API request
        for (const file of files) {
          // Update progress to show upload started
          newProgresses[file.name] = 0;
          setProgresses({ ...newProgresses });

          const formData = new FormData();
          formData.append('file', file);
          
          // If this is a job application upload with a temporary ID, format it consistently
          // Use a format that won't be mistaken for a UUID by Prisma
          let uploadEntityId = entityId;
          if (entityType === 'job_application' && uploadEntityId && uploadEntityId.startsWith('temp_')) {
            // Keep the ID as-is, don't modify it - the file-uploads handler will handle it
            console.log(`Using temporary job application ID: ${uploadEntityId}`);
          }
          
          formData.append('entityId', uploadEntityId || '');
          formData.append('entityType', entityType || '');
          formData.append('category', category || '');
          formData.append('userId', userId || '');

          // Update progress to show upload in progress
          newProgresses[file.name] = 50;
          setProgresses({ ...newProgresses });

          // Upload via the API route
          const response = await fetch("/api/file-uploads", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            let errorMessage = "Failed to upload file";
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
              console.error("Error parsing error response:", parseError);
            }
            
            console.error(`File upload error: ${errorMessage}, Status: ${response.status}`);
            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log("File upload successful:", {
            id: result.file.id,
            name: result.file.name,
            category: result.file.category,
            path: result.file.path
          });

          // Create the file record
          const uploadedFile: UploadedFile = {
            key: result.file.id,
            name: result.file.name,
            url: result.file.url,
            path: result.file.path,
            size: result.file.size,
            type: result.file.type,
            entityId: result.file.entityId,
            category: result.file.category,
            bucketName,
          };

          uploadedFilesList.push(uploadedFile);
          newProgresses[file.name] = 100;
          setProgresses({ ...newProgresses });

          // Show success toast
          toast.success(`${file.name} uploaded successfully`);
        }

        // Update the list of uploaded files
        setUploadedFiles((prev) => [...prev, ...uploadedFilesList]);
        return uploadedFilesList;
      } catch (error: any) {
        console.error("Error uploading files:", {
          error,
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: error.code,
          details: error.details
        });
        toast.error(`Upload error: ${error.message || "Unknown error"}`);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [bucketName, category, entityId, entityType, progresses, userId, uploadedFiles.length, maxFileCount]
  );

  // Update the entity ID for all uploaded files
  const updateEntityId = useCallback(
    async (newEntityId: string) => {
      try {
        console.log(
          `Updating entity ID from ${entityId} to ${newEntityId}`,
        );

        // Make an API call to update the entity IDs
        const response = await fetch("/api/file-uploads/update-entity", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldEntityId: entityId,
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

        setEntityId(newEntityId);
        return true;
      } catch (error) {
        console.error("Error updating entity ID:", error);
        return false;
      }
    },
    [entityId, entityType],
  );

  // Delete a file
  const deleteFile = useCallback(
    async (fileKey: string) => {
      try {
        const response = await fetch("/api/file-uploads", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileId: fileKey,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete file");
        }

        // Update local state
        setUploadedFiles((prev) => prev.filter((file) => file.key !== fileKey));
        toast.success("File deleted successfully");
        return true;
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Error deleting file. Please try again.");
        throw error;
      }
    },
    []
  );

  return {
    uploadedFiles,
    isUploading,
    progresses,
    entityId,
    onUpload,
    updateEntityId,
    deleteFile,
    setUploadedFiles,
  };
} 