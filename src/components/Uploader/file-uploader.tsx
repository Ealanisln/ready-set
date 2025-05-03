// src/components/Uploader/file-uploader.tsx

import React, { useCallback, useState } from "react";
import { useDropzone, FileWithPath, Accept } from "react-dropzone";
import { Upload, X, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onUpload: (files: FileWithPath[]) => Promise<void>;
  progresses?: Record<string, number>;
  isUploading?: boolean;
  accept?: Accept;
  maxSize?: number;
  maxFileCount?: number;
  multiple?: boolean;
  category?: string;
  entityType?: string;
  entityId?: string;
  children?: React.ReactNode;
}

export function FileUploader({
  onUpload,
  progresses = {},
  isUploading = false,
  accept = {
    "image/*": [],
    "application/pdf": [],
  },
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFileCount = 1,
  multiple = false,
  category,
  entityType,
  entityId,
  children,
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPath[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTemporarilyDisabled] = useState(false); // Changed from true to false to enable file uploads

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (isTemporarilyDisabled) {
        setError("File uploads are temporarily disabled. Please try again later.");
        return;
      }
      setError(null);
      
      // Validate file count
      if (acceptedFiles.length > maxFileCount) {
        setError(`You can only upload up to ${maxFileCount} file${maxFileCount !== 1 ? 's' : ''} at a time`);
        return;
      }
      
      // Additional validation if needed
      const invalidFiles = acceptedFiles.filter(file => file.size > maxSize);
      if (invalidFiles.length > 0) {
        setError(`Some files are too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(1)} MB`);
        return;
      }

      setSelectedFiles(acceptedFiles);
    },
    [maxFileCount, maxSize, isTemporarilyDisabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: multiple || (maxFileCount > 1),
    disabled: isUploading,
  });

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(async () => {
    try {
      if (selectedFiles.length === 0) return;
      
      // Debug log to see parameters
      console.log("FileUploader handleUpload - Parameters:", {
        entityType,
        entityId,
        category,
        files: selectedFiles.map(f => ({name: f.name, size: f.size, type: f.type}))
      });
      
      setError(null);
      await onUpload(selectedFiles);
      // Only clear selected files if upload was successful
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to upload. Please try again.");
      }
    }
  }, [selectedFiles, onUpload, entityType, entityId, category]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md transition-colors",
          isTemporarilyDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          isDragActive
            ? "border-primary/70 bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} disabled={isTemporarilyDisabled} />
        {children || (
          <div className="flex flex-col items-center justify-center text-center space-y-2 p-6">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">
                {isTemporarilyDisabled 
                  ? "File uploads are temporarily disabled"
                  : isDragActive 
                    ? "Drop the files here" 
                    : "Drag and drop files here"}
              </p>
              <p className="text-muted-foreground">
                {isTemporarilyDisabled ? "Please try again later" : "or click to browse"}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500 flex items-center space-x-1">
          <X className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between text-sm p-2 border rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </li>
            ))}
          </ul>
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="mt-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload</>
            )}
          </Button>
        </div>
      )}

      {isUploading && Object.keys(progresses).length > 0 && (
        <div className="space-y-2">
          {Object.entries(progresses).map(([filename, progress]) => (
            <div key={filename} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="truncate max-w-[200px]">{filename}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}