// src/hooks/use-upload-file.ts
import { useState, useCallback, useEffect } from "react";
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
  const [entityId, setEntityId] = useState<string>(initialEntityId || "");
  const [tempEntityId, setTempEntityId] = useState<string>("");

  // Generate a temporary entity ID on initialization if none exists
  useEffect(() => {
    if (!entityId && !tempEntityId) {
      const newTempId = `temp-${uuidv4()}`;
      console.log("Initializing temporary entity ID:", newTempId);
      setTempEntityId(newTempId);
    }
  }, [entityId, tempEntityId]);

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

  // Fetch existing files
  const fetchExistingFiles = useCallback(async () => {
    if (!entityId) return;

    try {
      const params = new URLSearchParams({
        entityId,
        entityType: entityType || "user",
      });
      if (category) {
        params.append("category", category);
      }

      console.log('Fetching files with params:', params.toString());
      const response = await fetch(`/api/file-uploads/get?${params}`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        console.error('Error details:', {
          status: response.status,
          statusText: response.statusText,
          data,
          entityId,
          entityType,
          category
        });
        const errorMessage = data.error || "Failed to fetch files";
        throw new Error(errorMessage);
      }

      if (data.success && data.files) {
        console.log('Setting uploaded files:', data.files);
        setUploadedFiles(data.files);
      } else {
        console.warn('Unexpected response format:', data);
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error("Error fetching existing files:", error);
    }
  }, [entityId, entityType, category]);

  // Initialize Supabase client and fetch existing files
  useEffect(() => {
    const init = async () => {
      await initSupabase();
      await fetchExistingFiles();
    };
    init();
  }, [initSupabase, fetchExistingFiles]);

  // Handle file uploads to Supabase Storage and register in database via API
  const onUpload = useCallback(
    async (files: FileWithPath[]): Promise<UploadedFile[]> => {
      // Check if adding these files would exceed the limit
      if (uploadedFiles.length + files.length > maxFileCount) {
        toast.error(`Cannot upload ${files.length} more files. Maximum ${maxFileCount} allowed.`);
        return [];
      }

      console.log("Starting file upload process...");
      console.log("Upload context:", { 
        bucketName, 
        entityType, 
        entityId: entityId || tempEntityId, 
        category,
        fileCount: files.length 
      });

      setIsUploading(true);
      const newProgresses = { ...progresses };
      const uploadedFilesList: UploadedFile[] = [];

      try {
        if (!files || files.length === 0) {
          toast.error("Please select at least one file to upload.");
          // No return here, let finally handle setIsUploading
        } else {
          // Loop through each file to upload
          for (const file of files) {
            console.log(`Processing file: ${file.name} (${file.size} bytes, type: ${file.type})`);
            
            // Check file size and type
             if (file.size > maxFileSize) {
              toast.error(`${file.name} exceeds the maximum file size of ${maxFileSize / (1024 * 1024)}MB.`);
              continue; // Skip this file
            }
            if (allowedFileTypes.length > 0 && !allowedFileTypes.some(type => file.type.startsWith(type))) {
              toast.error(`${file.name} has an unsupported file type.`);
              continue; // Skip this file
            }

            // Generate a proper path structure for order uploads
            let fileKey;
            // For catering orders, use a consistent path structure
            if (entityType === 'catering' || category === 'catering-order') {
              const currentId = entityId || tempEntityId;
              // Ensure consistent format for temporary entity IDs in storage paths
              const pathEntityId = currentId.startsWith('temp-') ? currentId : `temp-${currentId}`;
              fileKey = `catering_order/${pathEntityId}/${Date.now()}-${uuidv4().substring(0, 8)}`;
              console.log(`Generated catering file path: ${fileKey}`);
            } else {
              fileKey = `${userId || 'anonymous'}/${entityType || 'general'}/${category || 'uncategorized'}/${uuidv4().substring(0, 8)}-${file.name}`;
            }
            
            newProgresses[fileKey] = 0; // Use a unique key for progress tracking
            setProgresses({ ...newProgresses });

            const formData = new FormData();
            formData.append('file', file);
            
            // Use entityId state, fallback to tempEntityId if entity doesn't exist yet
            const currentEntityId = entityId || tempEntityId;
            console.log("Using entity ID:", currentEntityId);
            
            if (currentEntityId) {
              formData.append('entityId', currentEntityId);
            }
            if (entityType) {
              formData.append('entityType', entityType);
            }
            if (category) {
              formData.append('category', category);
            }
            if (userId) {
              formData.append('userId', userId);
            }
             if (bucketName) {
              formData.append('bucketName', bucketName);
            }

            // Log form data entries
            console.log("FormData entries:");
            for (const [key, value] of formData.entries()) {
              console.log(`- ${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
            }

            // Update progress simulation
            newProgresses[fileKey] = 50;
            setProgresses({ ...newProgresses });

            // Check for admin mode
            const isAdminMode = typeof window !== 'undefined' && localStorage.getItem('admin_mode') === 'true';

            // Upload via the API route
            console.log("Sending request to file upload API...");
            const response = await fetch("/api/file-uploads", {
              method: "POST",
              headers: {
                // Add admin mode headers
                ...(isAdminMode ? {
                  "x-request-source": "AdminPanel",
                  "x-admin-mode": "true"
                } : {})
              },
              body: formData,
            });

            console.log("Upload API response status:", response.status);
             
             if (!response.ok) {
               let errorData;
               try {
                 errorData = await response.json();
                 console.error("Upload error response:", errorData);
               } catch (e) {
                 // If response is not JSON
                 errorData = { error: response.statusText || "Upload failed" };
                 console.error("Failed to parse error response:", e);
               }
               
               // Format error message based on the response
               let errorMessage = errorData.error || "Upload failed";
               
               // Handle specific cases like bucket not found
               if (errorMessage.includes("Bucket not found") || errorMessage.includes("not found")) {
                 errorMessage = `Storage bucket unavailable. Please contact support.`;
               } else if (errorMessage.includes("permission") || errorMessage.includes("policy")) {
                 errorMessage = `Permission denied to upload files. Please contact support.`;
               }
               
               toast.error(`Upload failed for ${file.name}: ${errorMessage}`);
               delete newProgresses[fileKey]; // Remove progress for failed upload
               setProgresses({ ...newProgresses });
               continue; // Skip this file, proceed with others
             }

            const result = await response.json();
            console.log("Upload API success response:", result);

             if (!result.success || !result.file) {
              console.error("Upload API returned success:false or no file data:", result);
              toast.error(`Upload failed for ${file.name}: Invalid server response.`);
              delete newProgresses[fileKey];
              setProgresses({...newProgresses});
              continue;
             }

            // Create the file record from API response
            const uploadedFile: UploadedFile = {
              key: result.file.id, // Assuming the API returns 'id' as the key
              name: result.file.name,
              url: result.file.url,
              path: result.file.path,
              size: result.file.size,
              type: result.file.type,
              entityId: result.file.entityId,
              category: result.file.category,
              bucketName: result.file.bucketName, // Ensure API returns this
            };

            uploadedFilesList.push(uploadedFile);
            newProgresses[fileKey] = 100;
            setProgresses({ ...newProgresses });

            // Optional: Short delay before removing progress bar
            setTimeout(() => {
              setProgresses((prev) => {
                const updated = { ...prev };
                delete updated[fileKey];
                return updated;
              });
            }, 1000);

            toast.success(`${file.name} uploaded successfully`);
          }
        }
        
        console.log("All files processed. Upload complete.");

        // Update the list of uploaded files in the state
        setUploadedFiles((prev) => [...prev, ...uploadedFilesList]);
        return uploadedFilesList;

      } catch (error: any) {
        console.error("Error during the upload process:", error);
        toast.error(`Upload error: ${error.message || "Unknown error"}`);
        // Depending on the desired behavior, you might want to re-throw the error
        // or return an empty array / handle it differently.
        // For now, return the files that were successfully uploaded before the error.
         return uploadedFilesList;
      } finally {
        setIsUploading(false);
         // Clear progresses for files that didn't finish? Or rely on timeout removal?
         // setProgresses({}); // Maybe clear all progresses here? Depends on UX choice.
      }
    },
    [
      progresses,
      uploadedFiles.length, // Add dependency
      maxFileCount,        // Add dependency
      maxFileSize,         // Add dependency
      allowedFileTypes,    // Add dependency
      entityId,            // Add dependency
      tempEntityId,        // Add dependency
      entityType,          // Add dependency
      category,            // Add dependency
      userId,              // Add dependency
      bucketName,          // Add dependency
      // initSupabase,     // Remove if not directly used inside onUpload
    ]
  );

  // Function to generate a temporary entity ID if one doesn't exist
  const ensureTempEntityId = useCallback(() => {
    if (!entityId && !tempEntityId) {
      const newTempId = uuidv4();
      console.log("Generating temporary entity ID:", newTempId);
      setTempEntityId(newTempId);
      return newTempId;
    }
    return entityId || tempEntityId;
  }, [entityId, tempEntityId]);

  // Update the entity ID for all uploaded files (using tempEntityId if needed)
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
        const fileUrlMatch = fileInfo.fileUrl.match(/user-assets\/([^?#]+)/);
        const filePath = fileUrlMatch?.[1];

        if (!filePath) {
          throw new Error("Could not determine file path from URL");
        }

        // Delete file from Supabase Storage
        const { data, error } = await client.storage
          .from(bucketName)
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
    [initSupabase, bucketName],
  );

  return {
    uploadedFiles,
    isUploading,
    progresses,
    entityId,
    tempEntityId,
    onUpload,
    updateEntityId,
    deleteFile,
    deleteFileWithSupabase,
  };
}
