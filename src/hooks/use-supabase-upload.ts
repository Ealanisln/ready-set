// hooks/use-supabase-upload.ts
import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseClient } from '@supabase/supabase-js';
import { FileWithPath } from 'react-dropzone';
import toast from 'react-hot-toast';

export type UploadedFile = {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
  entityId?: string;
};

interface UseSupabaseUploadOptions {
  bucketName: string;
  folder?: string;
  maxFileCount?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  entityType?: string;
  userId?: string;
  entityId?: string;
}

export function useSupabaseUpload(options: UseSupabaseUploadOptions) {
  const {
    bucketName,
    folder = '',
    maxFileCount = 5,
    maxFileSize = 10 * 1024 * 1024, // 10MB by default
    allowedFileTypes = [],
    entityType,
    userId,
    entityId: initialEntityId,
  } = options;

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [tempEntityId, setTempEntityId] = useState<string>(initialEntityId || uuidv4());

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
      const client = await initSupabase();
      if (!client) throw new Error("Failed to initialize Supabase client");

      // Validate file count
      if (uploadedFiles.length + files.length > maxFileCount) {
        throw new Error(`You can only upload up to ${maxFileCount} files`);
      }

      setIsUploading(true);
      const newProgresses = { ...progresses };
      const uploadResults: UploadedFile[] = [];

      try {
        // Create bucket if it doesn't exist
        // Note: This requires storage admin privileges, might not work for all users
        try {
          const { data: bucketData, error: bucketError } = await client.storage.getBucket(bucketName);
          if (!bucketData && !bucketError) {
            await client.storage.createBucket(bucketName, {
              public: false,
              allowedMimeTypes: allowedFileTypes.length > 0 ? allowedFileTypes : undefined,
              fileSizeLimit: maxFileSize,
            });
          }
        } catch (bucketError) {
          console.warn("Unable to check/create bucket, assuming it exists:", bucketError);
        }

        // Process each file
        for (const file of files) {
          // Validate file size
          if (file.size > maxFileSize) {
            throw new Error(`File ${file.name} exceeds the maximum size of ${maxFileSize / 1024 / 1024}MB`);
          }

          // Validate file type if restrictions exist
          if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
            throw new Error(`File type ${file.type} is not allowed`);
          }

          // Generate unique file path
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = folder ? `${folder}/${fileName}` : fileName;

          newProgresses[file.name] = 0;
          setProgresses(newProgresses);

          // Upload file to Supabase Storage
          const { data, error } = await client.storage
            .from(bucketName)
            .upload(filePath, file, {
              upsert: false,
              contentType: file.type,
            });

          if (error) throw error;

          // Get public URL for the file
          const { data: urlData } = client.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          // Add metadata to database if needed
          // This would be a good place to associate the file with entityId, entityType, etc.
          // You might want to create a separate table for this in your database

          const uploadedFile: UploadedFile = {
            key: data.path,
            name: file.name,
            url: urlData.publicUrl,
            size: file.size,
            type: file.type,
            entityId: tempEntityId,
          };

          uploadResults.push(uploadedFile);
          newProgresses[file.name] = 100;
        }

        setProgresses(newProgresses);
        setUploadedFiles(prev => [...prev, ...uploadResults]);
        return uploadResults;
      } catch (error) {
        console.error("Error uploading files to Supabase:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [
      bucketName,
      folder,
      maxFileCount,
      maxFileSize,
      allowedFileTypes,
      initSupabase,
      progresses,
      uploadedFiles,
      tempEntityId,
    ]
  );

  // Update the entity ID for all uploaded files
  const updateEntityId = useCallback(
    async (newEntityId: string) => {
      const client = await initSupabase();
      if (!client) throw new Error("Failed to initialize Supabase client");

      // Update the entity ID in your database
      // This would depend on how you store file metadata
      // For simplicity, we'll just update our local state
      setUploadedFiles(prev =>
        prev.map(file => ({
          ...file,
          entityId: newEntityId
        }))
      );

      // If you have a files table in your database, you would update it here:
      // await client.from('file_uploads').update({ entityId: newEntityId }).eq('entityId', tempEntityId);

      setTempEntityId(newEntityId);
      return true;
    },
    [initSupabase]
  );

  // Delete a file from Supabase Storage
  const deleteFile = useCallback(
    async (fileKey: string) => {
      const client = await initSupabase();
      if (!client) throw new Error("Failed to initialize Supabase client");

      try {
        const { error } = await client.storage.from(bucketName).remove([fileKey]);
        if (error) throw error;

        // Update local state to remove the deleted file
        setUploadedFiles(prev => prev.filter(file => file.key !== fileKey));
        return true;
      } catch (error) {
        console.error("Error deleting file from Supabase:", error);
        throw error;
      }
    },
    [bucketName, initSupabase]
  );

  return {
    uploadedFiles,
    isUploading,
    progresses,
    tempEntityId,
    onUpload,
    updateEntityId,
    deleteFile,
  };
}