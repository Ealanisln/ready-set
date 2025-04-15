import React, { useState } from "react";
import { FileWithPath } from "react-dropzone";
// import { JobApplicationUploader } from "./JobApplicationUploader"; // Removed as it's not used and was commented out
import { UseFormRegister } from "react-hook-form";
import type { FormData } from "./types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, Upload, X, Loader2 } from 'lucide-react';
import { UploadedFile } from "@/hooks/use-upload-file"; // Assuming type location
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  name: keyof FormData;
  label: string;
  // register: UseFormRegister<FormData>; // register is passed but not used, removing
  required?: boolean;
  error?: { message?: string };
  // uploadConfig: { // uploadConfig is passed but not used directly, removing
  //   category: string;
  //   entityType: string;
  //   entityId: string;
  //   allowedFileTypes: string[];
  // };
  startUpload: (files: FileWithPath[]) => Promise<UploadedFile[]>;
  isUploading: boolean; // Using this now
  progresses?: Record<string, number>; // Using this now
  accept?: string;
  // fileId: string | null; // Replacing with UploadedFile object
  file: UploadedFile | null;
  deleteFile: (key: string) => Promise<boolean>;
}

export function FileUpload({
  label,
  required,
  // error,
  // uploadConfig,
  // onUploadComplete,
  startUpload,
  isUploading,
  progresses,
  accept = 'application/pdf',
  // fileId,
  // onFileUpload
  file,
  deleteFile,
  error // Error prop from react-hook-form if needed for field-level display
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(file?.name || null);
  const progress = fileName ? progresses?.[fileName] : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target.files?.[0];
    if (!inputFile) return;

    // Update local state to show file name while uploading
    setFileName(inputFile.name);

    // Delegate upload to the hook
    startUpload([inputFile as FileWithPath]).catch(() => {
      // Reset filename if upload fails, rely on hook's toast for error message
      setFileName(null);
    });

    // Reset input value to allow re-uploading the same file
    e.target.value = "";
  };

  const handleRemove = async () => {
    if (!file?.key) return;
    try {
      await deleteFile(file.key);
      setFileName(null); // Clear local file name on successful delete
    } catch {
      // Error handled by hook's toast
    }
  };

  const displayFileName = file?.name || fileName;

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {!file && !isUploading ? (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading} // Keep disabled during upload
            className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-yellow-100 file:bg-yellow-50 file:text-yellow-700 cursor-pointer"
          />
          <Upload className="text-gray-400" />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-md">
          {isUploading && progress !== 100 ? (
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
          ) : (
            <FileCheck className="h-5 w-5 text-green-600" />
          )}
          <div className="flex-grow space-y-1">
            <span className="text-sm font-medium text-gray-700 truncate block">{displayFileName ?? 'File'}</span>
            {isUploading && typeof progress === 'number' && progress < 100 && (
              <Progress value={progress} className="h-1" />
            )}
            {!isUploading && file && (
              <span className="text-xs text-green-700">Upload complete</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleRemove}
            disabled={isUploading} // Disable remove during upload
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Display react-hook-form error if provided */}
      {error?.message && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
} 