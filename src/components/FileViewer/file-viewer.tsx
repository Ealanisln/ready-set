// components/FileViewer/FileViewer.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Eye, ImageIcon } from "lucide-react";
import { FileUpload } from "@/types/file";

interface FileViewerProps {
  file: FileUpload | null;
  onClose: () => void;
  isOpen: boolean;
}

function FileViewer({ file, onClose, isOpen }: FileViewerProps) {
  const isImage = file?.fileType?.startsWith('image/');
  const isPDF = file?.fileType === 'application/pdf';

  if (!file) return null;

  if (isImage) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[80vh] max-w-4xl">
          <div className="relative h-full w-full" style={{ minHeight: "300px" }}>
            <Image
              src={file.fileUrl}
              alt={file.fileName}
              fill
              className="rounded-md object-contain"
            />
          </div>
          <div className="mt-4 text-right">
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Open full size
              <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isPDF) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="h-[80vh] max-w-4xl p-0">
          <div className="flex h-full flex-col">
            <iframe
              src={`${file.fileUrl}#toolbar=0`}
              title={file.fileName}
              className="flex-grow border-none"
            />
            <div className="border-t bg-white p-4">
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Open in new tab
                <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center p-4">
          <div className="mb-4 flex justify-center">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
          <p className="mb-4">This file type cannot be previewed.</p>
          <a
            href={file.fileUrl}
            download={file.fileName}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Download File
            <ExternalLink size={16} className="ml-1" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileViewer;