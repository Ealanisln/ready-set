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

// Update types to match v7
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

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  props: UseUploadFileProps
) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadThingFile[]>(props.defaultUploadedFiles ?? []);
  const [progresses, setProgresses] = React.useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = React.useState(false);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res) {
        setUploadedFiles((prev) => [...prev, ...res as UploadThingFile[]]);
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
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

  const onUpload = async (files: FileWithPath[]): Promise<UploadThingFile[]> => {
    setIsUploading(true);
    try {
      const result = await startUpload(files);
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