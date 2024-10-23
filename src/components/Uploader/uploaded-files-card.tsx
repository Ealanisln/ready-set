import React from 'react';
import Image from "next/image";
import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/Uploader/empty-card";

interface FileUpload {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  entityType: string;
  entityId: string;
  category?: string;
  uploadedAt: Date;
  updatedAt: Date;
  userId?: string;
  cateringRequestId?: number;
  onDemandId?: number;
}

interface UploadedFilesViewerProps {
  files: FileUpload[];
  title?: string;
  description?: string;
}

export function UploadedFilesViewer({ 
  files, 
  title = "Uploaded Files",
  description = "View uploaded files"
}: UploadedFilesViewerProps) {
  const isImage = (fileType: string) => {
    return fileType.startsWith('image');
  };

  const isPDF = (fileType: string) => {
    return fileType === 'application/pdf';
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {files && files.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {isImage(file.fileType) ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={file.fileUrl}
                          alt={file.fileName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <FileText 
                        className="h-10 w-10 text-muted-foreground" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="flex flex-col">
                      <p className="font-medium line-clamp-1">{file.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file.fileUrl, file.fileName)}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files available"
            description="No files have been uploaded yet"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}