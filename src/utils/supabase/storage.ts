import { createClient } from '@/utils/supabase/server';

/**
 * Utility class for interacting with Supabase Storage
 * 
 * This provides a cleaner interface for handling storage operations
 * while managing the async initialization behind the scenes
 */
export const storage = {
  /**
   * Access a storage bucket
   * 
   * @param bucket - Name of the storage bucket
   * @returns A promise that resolves to the bucket interface
   */
  from: async (bucket: string) => {
    const supabase = await createClient();
    const storageClient = supabase.storage;
    const bucketClient = storageClient.from(bucket);
    
    return {
      /**
       * Upload a file to the bucket
       */
      upload: async (path: string, fileBody: File | Blob | ArrayBuffer | string) => {
        return await bucketClient.upload(path, fileBody);
      },
      
      /**
       * Remove one or more files from the bucket
       */
      remove: async (paths: string[]) => {
        return await bucketClient.remove(paths);
      },
      
      /**
       * Get a public URL for a file
       */
      getPublicUrl: (path: string) => {
        return bucketClient.getPublicUrl(path);
      },
      
      /**
       * Create a signed URL for a file (time-limited access)
       */
      createSignedUrl: async (path: string, expiresIn: number) => {
        return await bucketClient.createSignedUrl(path, expiresIn);
      }
    };
  }
};