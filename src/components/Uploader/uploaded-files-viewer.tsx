import React, { useState } from "react";
import { FileUpload } from "@/types/file";
import { FileIcon, FileText, Image as ImageIcon } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UploadedFilesViewerProps {
  files: FileUpload[];
  isLoading?: boolean;
}

const UploadedFilesViewer: React.FC<UploadedFilesViewerProps> = ({
  files,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);

  const getFileIcon = (fileType: string | null) => {
    if (fileType?.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    if (fileType === "application/pdf") {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  const handleFileClick = (file: FileUpload) => {
    console.log("File clicked:", file); // Debug log
    setSelectedFile(file);
  };

  const renderPreview = () => {
    if (!selectedFile) return null;

    console.log("Rendering preview for:", selectedFile); // Debug log

    // Handle image files
    if (
      selectedFile.fileType?.startsWith("image/") ||
      selectedFile.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    ) {
      return (
        <div className="relative flex h-[60vh] w-full items-center justify-center rounded-lg bg-black/5">
          <Image
            src={selectedFile.fileUrl}
            alt={selectedFile.fileName}
            className="max-h-full max-w-full object-contain"
            onError={(e) => console.error("Image load error:", e)} // Debug log
          />
        </div>
      );
    }

    // Handle PDF files
    if (
      selectedFile.fileType === "application/pdf" ||
      selectedFile.fileName.endsWith(".pdf")
    ) {
      return (
        <div className="h-[60vh] w-full rounded-lg bg-gray-50">
          <iframe
            src={selectedFile.fileUrl}
            className="h-full w-full rounded-lg"
            title={`PDF preview of ${selectedFile.fileName}`}
          />
        </div>
      );
    }

    // Fallback for other file types
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileIcon className="mb-4 h-16 w-16" />
        <p className="text-muted-foreground mb-4 text-center">
          Preview not available for this file type
        </p>
        <Button
          onClick={() => window.open(selectedFile.fileUrl, "_blank")}
          variant="outline"
        >
          Download File
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-4 rounded-md border p-4"
          >
            <Skeleton className="h-12 w-12" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {files.length === 0 ? (
          <div className="text-muted-foreground flex items-center justify-center py-8">
            No files uploaded yet
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="hover:bg-accent/50 flex cursor-pointer items-center space-x-4 rounded-md border p-4 transition-colors"
              onClick={() => handleFileClick(file)}
            >
              <div className="flex-shrink-0">{getFileIcon(file.fileType)}</div>
              <div className="min-w-0 flex-grow">
                <p className="truncate font-medium">{file.fileName}</p>
                <div className="text-muted-foreground flex gap-2 text-sm">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>•</span>
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog
        open={!!selectedFile}
        onOpenChange={(open) => !open && setSelectedFile(null)}
      >
        <DialogContent className="w-11/12 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFile && getFileIcon(selectedFile.fileType)}
              <span className="truncate">{selectedFile?.fileName}</span>
            </DialogTitle>
          </DialogHeader>
          {renderPreview()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadedFilesViewer;
