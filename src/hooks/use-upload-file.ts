// src/hooks/use-upload-file.ts
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
  entityId: string;
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

  const { startUpload } = useUploadThing(endpoint, {
    headers: {
      'x-category': props.category,
      'x-entity-type': props.entityType,
      'x-entity-id': props.entityId,
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
    metadata?: {
      category: string;
      entityType: string;
      entityId: string;
    }
  ): Promise<UploadThingFile[]> => {
    setIsUploading(true);
    
    try {
      const preparedFiles = files.map(file => {
        const sanitizedName = sanitizeFileName(file.name);
        return new File([file], sanitizedName, { type: file.type });
      });

      // In v7, we don't pass metadata as second parameter
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

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  } as const;
}