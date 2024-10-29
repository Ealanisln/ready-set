import * as React from "react";
import type { FileWithPath } from "react-dropzone";
import { toast } from "@/components/ui/use-toast";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export type UploadThingFile = {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
  serverData: unknown;
  customId?: string | null;
}

interface UseUploadFileProps {
  defaultUploadedFiles?: UploadThingFile[];
  userId?: string;
  maxFileCount?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onUploadBegin?: () => void;
  onUploadProgress?: (progress: number) => void;
  category: string;
  entityType: string;
  entityId: string;  // Added this line
  orderNumber?: string;
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const sanitizeFileName = (fileName: string): string => {
  const sanitized = fileName
    .replace(/%20/g, ' ')
    .replace(/[^\w\s.-]/g, '')
    .trim();
  return sanitized;
};

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  props: UseUploadFileProps
) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadThingFile[]>(
    props.defaultUploadedFiles ?? []
  );
  const [progresses, setProgresses] = React.useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = React.useState(false);
  const [tempEntityId] = React.useState(`temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const { startUpload } = useUploadThing(endpoint, {
    headers: {
      'x-category': props.category,
      'x-entity-type': props.entityType,
      'x-entity-id': props.entityId || tempEntityId,  // Updated to use props.entityId
      ...(props.orderNumber && { 'x-order-number': props.orderNumber }),
    },
    onClientUploadComplete: (res) => {
      if (res) {
        const sanitizedRes = res.map(file => ({
          ...file,
          name: sanitizeFileName(file.name)
        })) as UploadThingFile[];
        
        setUploadedFiles((prev) => [...prev, ...sanitizedRes]);
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      console.error('Upload error details:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
      props.onUploadBegin?.();
    },
    onUploadProgress: (progress: number) => {
      setProgresses((prev) => ({
        ...prev,
        progress: progress,
      }));
      props.onUploadProgress?.(progress);
    },
  });

  const onUpload = async (
    files: FileWithPath[],
  ): Promise<UploadThingFile[]> => {
    setIsUploading(true);
    
    try {
      const preparedFiles = files.map(file => {
        const sanitizedName = sanitizeFileName(file.name);
        return new File([file], sanitizedName, { type: file.type });
      });

      const result = await startUpload(preparedFiles);
      
      if (!result) {
        throw new Error("Upload failed");
      }
      
      return result as UploadThingFile[];
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Add a method to update entityId for all uploaded files
  const updateEntityId = async (newEntityId: string) => {
    try {
      const response = await fetch('/api/uploadthing/update-entity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldEntityId: tempEntityId,
          newEntityId,
          entityType: props.entityType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update entity ID');
      }
    } catch (error) {
      console.error('Error updating entity ID:', error);
      throw error;
    }
  };

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
    tempEntityId,
    updateEntityId,
  } as const;
}