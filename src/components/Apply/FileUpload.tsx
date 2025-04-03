import React, { useState } from "react";
import { FileUploader } from "@/components/Uploader/file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";
import { FileWithPath } from "react-dropzone";
import { File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface FileUploadProps {
  name: string;
  label: string;
  required?: boolean;
  error?: any;
  uploadConfig: {
    category: string;
    entityType: string;
    entityId: string;
    allowedFileTypes: string[];
  };
  onUploadComplete: (files: any[]) => void;
}

// Helper function to convert file extensions to MIME types
const getMimeTypes = (extensions: string[]): string[] => {
  return extensions.map(ext => {
    switch (ext.toLowerCase()) {
      case '.pdf':
        return 'application/pdf';
      case '.doc':
        return 'application/msword';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      default:
        return '';
    }
  }).filter(Boolean);
};

export function FileUpload({
  name,
  label,
  required = false,
  error,
  uploadConfig,
  onUploadComplete,
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const { onUpload, progresses, isUploading, deleteFile } = useUploadFile({
    category: uploadConfig.category,
    entityType: uploadConfig.entityType,
    entityId: uploadConfig.entityId,
    allowedFileTypes: getMimeTypes(uploadConfig.allowedFileTypes),
    maxFileCount: 1,
    userId: "temp_application_user",
  });

  const handleUpload = async (files: FileWithPath[]) => {
    try {
      const uploadedFiles = await onUpload(files);
      if (uploadedFiles && uploadedFiles.length > 0) {
        const file = uploadedFiles[0];
        setUploadedFile(file);
        onUploadComplete([{
          ...file,
          fileUrl: file.url // Ensure we're passing the URL correctly
        }]);
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (uploadedFile?.key) {
      try {
        await deleteFile(uploadedFile.key);
        setUploadedFile(null);
        onUploadComplete([]);
        toast({
          title: "Success",
          description: "File removed successfully",
        });
      } catch (error) {
        console.error("Error deleting file:", error);
        toast({
          title: "Error",
          description: "Failed to remove file. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Convert allowedFileTypes to the correct format for react-dropzone
  const accept = uploadConfig.allowedFileTypes.reduce((acc, ext) => {
    if (ext === '.pdf') {
      acc['application/pdf'] = ['.pdf'];
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      acc['image/*'] = ['.jpg', '.jpeg', '.png'];
    } else if (['.doc', '.docx'].includes(ext)) {
      acc['application/msword'] = ['.doc'];
      acc['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {uploadedFile ? (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{uploadedFile.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ) : (
        <FileUploader
          onUpload={handleUpload}
          progresses={progresses}
          isUploading={isUploading}
          maxFileCount={1}
          accept={accept}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
} 