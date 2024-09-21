import * as React from "react";
import type { UploadedFile } from "@/types/uploaded-file";
import toast from "react-hot-toast";
import type { UploadFilesOptions } from "uploadthing/types";

import { getErrorMessage } from "@/lib/handle-error";
import { uploadFiles } from "@/lib/uploadthing";
import { type OurFileRouter } from "@/app/api/uploadthing/core";

type UploadOptionsType = UploadFilesOptions<OurFileRouter, keyof OurFileRouter>;

interface UseUploadFileProps {
  defaultUploadedFiles?: UploadedFile[]
  maxFileCount?: number
  maxFileSize?: number
  allowedFileTypes?: string[]
  userId?: string  // Make userId optional
  headers?: UploadOptionsType['headers']
  onUploadBegin?: UploadOptionsType['onUploadBegin']
  onUploadProgress?: UploadOptionsType['onUploadProgress']
  skipPolling?: UploadOptionsType['skipPolling']
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { 
    defaultUploadedFiles = [], 
    maxFileCount = 4,
    maxFileSize = 4 * 1024 * 1024, // 4MB
    allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    userId,
    headers,
    onUploadBegin,
    onUploadProgress,
    skipPolling,
  }: UseUploadFileProps = {} 
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    // Validation logic remains the same...

    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        files,
        headers,
        onUploadBegin,
        skipPolling,
        onUploadProgress: (opts) => {
          setProgresses((prev) => ({
            ...prev,
            [opts.file]: opts.progress,
          }));
          onUploadProgress?.(opts);
        },
      });

      // Save uploaded files to the database
      const savedFiles = await saveFilesToDatabase(res, userId);

      setUploadedFiles((prev) => {
        return prev ? [...prev, ...savedFiles] : savedFiles;
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  // Updated function to save files to the database
  async function saveFilesToDatabase(files: UploadedFile[], userId?: string) {
    try {
      const response = await fetch("/api/save-uploaded-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save files to database");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving files to database:", error);
      toast.error("Failed to save file information");
      return files; // Return original files if saving to database fails
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
