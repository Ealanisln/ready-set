// utils/file-service.ts
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// File metadata type
export interface FileMetadata {
  id: string;
  file_key: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the buckets we'll use in the application
export const STORAGE_BUCKETS = {
  DEFAULT: 'user-assets',
  FILE_UPLOADER: 'fileUploader',
  CATERING_FILES: 'catering-files',
  USER_FILES: 'user-files',
  PROFILE_IMAGES: 'profile-images',
  ORDER_FILES: 'order-files',
} as const;

// Function to create storage buckets (run on app initialization)
export async function initializeStorageBuckets() {
  const supabase = await createClient();

  try {
    // Create all the necessary buckets
    for (const bucketName of Object.values(STORAGE_BUCKETS)) {
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error && error.message.includes('does not exist')) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket(bucketName, {
          public: false,
          fileSizeLimit: 10 * 1024 * 1024, // 10MB
        });
        console.log(`Created bucket: ${bucketName}`);
      } else if (error) {
        console.error(`Error checking bucket ${bucketName}:`, error);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return { success: false, error };
  }
}

// Function to get a URL for a file
export async function getFileUrl(bucketName: string, filePath: string) {
  const supabase = await createClient();
  
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
}

// Function to generate a signed URL for a file (useful for private files)
export async function getSignedUrl(bucketName: string, filePath: string, expiresIn = 60) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);
    
    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}

// Function to save file metadata to database
export async function saveFileMetadata(metadata: Omit<FileMetadata, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient();
  
  try {
    // Use raw query to avoid type issues with the file_metadata table
    // that's not properly typed in the Supabase client
    const { data, error } = await (supabase as any)
      .from('file_metadata')
      .insert([metadata])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving file metadata:', error);
    throw error;
  }
}

// Function to update entity ID for files
export async function updateFileEntityId(oldEntityId: string, newEntityId: string, userId: string) {
  const supabase = await createClient();
  
  try {
    // Use a direct RPC call that's defined in the database
    const { data, error } = await (supabase as any)
      .rpc('update_file_entity_id', {
        p_old_entity_id: oldEntityId,
        p_new_entity_id: newEntityId,
        p_user_id: userId
      });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error updating file entity ID:', error);
    throw error;
  }
}

// Function to get files for an entity
export async function getFilesForEntity(entityType: string, entityId: string) {
  const supabase = await createClient();
  
  try {
    // Use type assertion to bypass type checking for the file_metadata table
    const { data, error } = await (supabase as any)
      .from('file_metadata')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting files for entity:', error);
    throw error;
  }
}

// Function to delete a file and its metadata
export async function deleteFile(fileKey: string, bucketName: string) {
  const supabase = await createClient();
  
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([fileKey]);
    
    if (storageError) throw storageError;
    
    // Delete metadata using type assertion
    const { error: dbError } = await (supabase as any)
      .from('file_metadata')
      .delete()
      .eq('file_key', fileKey);
    
    if (dbError) throw dbError;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Function to delete orphaned files
export async function cleanupOrphanedFiles(timeThreshold = 24) {
  const supabase = await createClient();
  
  try {
    // Find all temporary files older than threshold
    const getTempFilesWithPrefix = async (prefix: string) => {
      const { data, error } = await (supabase as any)
        .from('file_metadata')
        .select('*')
        .like('entity_id', `${prefix}%`)
        .lt('created_at', new Date(Date.now() - timeThreshold * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return data || [];
    };
    
    // Get files with both temp- and temp_ prefixes
    const tempDashFiles = await getTempFilesWithPrefix('temp-');
    const tempUnderscoreFiles = await getTempFilesWithPrefix('temp_');
    
    // Combine the results
    const orphanedFiles = [...tempDashFiles, ...tempUnderscoreFiles];
    
    if (!orphanedFiles || orphanedFiles.length === 0) {
      return { success: true, deleted: 0 };
    }
    
    console.log(`Found ${orphanedFiles.length} orphaned files to clean up`);
    
    // Define a type for the orphaned file records
    interface OrphanedFile {
      id: string;
      file_key: string;
      file_url: string;
    }
    
    // Group files by bucket for efficient deletion
    const filesByBucket: Record<string, string[]> = {};
    
    // Process each orphaned file
    for (const file of orphanedFiles as OrphanedFile[]) {
      try {
        let bucketName: string;
        let filePath: string;
        
        // Try to extract bucket and path from file_url first (more reliable)
        if (file.file_url) {
          try {
            const url = new URL(file.file_url);
            const pathParts = url.pathname.split('/');
            
            // Find the index of "public" which comes before the bucket name
            const publicIndex = pathParts.findIndex(part => part === 'public');
            
            if (publicIndex !== -1 && publicIndex + 1 < pathParts.length) {
              bucketName = pathParts[publicIndex + 1];
              // The path is everything after the bucket name
              filePath = pathParts.slice(publicIndex + 2).join('/');
              
              // Add the file to the appropriate bucket group
              if (!filesByBucket[bucketName]) filesByBucket[bucketName] = [];
              filesByBucket[bucketName].push(filePath);
              
              continue;
            }
          } catch (urlError) {
            console.error('Error parsing file URL:', urlError);
            // Fall through to the file_key method below
          }
        }
        
        // Fallback to file_key parsing if URL parsing failed
        if (file.file_key) {
          // Try to determine if the key includes the bucket name
          // Format could be either "bucket/path" or just "path"
          const knownBuckets = Object.values(STORAGE_BUCKETS);
          const keyParts = file.file_key.split('/');
          
          if (knownBuckets.includes(keyParts[0] as any)) {
            // If first part is a known bucket, use it
            bucketName = keyParts[0];
            filePath = keyParts.slice(1).join('/');
          } else {
            // Otherwise, assume it's a path in the default bucket
            bucketName = STORAGE_BUCKETS.DEFAULT;
            filePath = file.file_key;
          }
          
          // Add the file to the appropriate bucket group
          if (!filesByBucket[bucketName]) filesByBucket[bucketName] = [];
          filesByBucket[bucketName].push(filePath);
        }
      } catch (parseError) {
        console.error('Error processing orphaned file:', parseError);
      }
    }
    
    console.log('Files to delete by bucket:', Object.entries(filesByBucket).map(
      ([bucket, paths]) => `${bucket}: ${paths.length} files`
    ));
    
    // Delete files from storage
    for (const [bucket, paths] of Object.entries(filesByBucket)) {
      if (paths.length > 0) {
        const { error } = await supabase.storage.from(bucket).remove(paths);
        if (error) {
          console.error(`Error deleting files from bucket ${bucket}:`, error);
        } else {
          console.log(`Successfully deleted ${paths.length} files from bucket ${bucket}`);
        }
      }
    }
    
    // Delete metadata records
    const { error: deleteError } = await (supabase as any)
      .from('file_metadata')
      .delete()
      .in('id', orphanedFiles.map(f => f.id));
    
    if (deleteError) throw deleteError;
    
    console.log(`Successfully deleted ${orphanedFiles.length} file metadata records`);
    
    return { success: true, deleted: orphanedFiles.length };
  } catch (error) {
    console.error('Error cleaning up orphaned files:', error);
    throw error;
  }
}