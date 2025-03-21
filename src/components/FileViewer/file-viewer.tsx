// components/FileViewer/file-viewer.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/types/file";
import { X, Download } from "lucide-react";

interface FileViewerProps {
  file: FileUpload | null;
  isOpen: boolean;
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, isOpen, onClose }) => {
  if (!file) return null;

  const isPDF = file.fileType === "application/pdf";
  const isImage = file.fileType?.startsWith("image/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="pr-10">{file.fileName}</DialogTitle>
          <DialogDescription>
            {new Date(file.uploadedAt).toLocaleDateString()} • {file.fileSize} bytes
          </DialogDescription>
          <Button
            className="absolute right-4 top-4"
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="flex justify-center overflow-auto max-h-[60vh]">
          {isPDF && (
            <iframe
              src={`${file.fileUrl}#view=FitH`}
              className="w-full h-[65vh]"
              title={file.fileName}
            />
          )}
          
          {isImage && (
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="max-w-full max-h-[65vh] object-contain"
            />
          )}
          
          {!isPDF && !isImage && (
            <div className="flex flex-col items-center justify-center h-[65vh]">
              <p className="text-center mb-4">
                This file type cannot be previewed directly.
              </p>
              <Button
                onClick={() => window.open(file.fileUrl, "_blank")}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => window.open(file.fileUrl, "_blank")}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewer;