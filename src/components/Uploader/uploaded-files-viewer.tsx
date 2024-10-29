import React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileIcon, FileText, Eye, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFileSize, formatDate } from "@/lib/utils";
import { FileUpload } from "@/types/file";

interface UploadedFilesViewerProps {
  files: FileUpload[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const UploadedFilesViewer = ({
  files,
  title,
  description,
  isLoading = false,
}: UploadedFilesViewerProps) => {
  const [selectedFile, setSelectedFile] = React.useState<FileUpload | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const handleFileClick = (file: FileUpload) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const renderFilePreview = (file: FileUpload) => {
    const isImage = file.fileType?.startsWith('image/');
    const isPDF = file.fileType === 'application/pdf';

    if (isImage) {
      return (
        <Button 
          variant="outline" 
          className="h-20 w-20 p-0 relative overflow-hidden" 
          onClick={() => handleFileClick(file)}
        >
          <Image
            src={file.fileUrl}
            alt={file.fileName}
            className="object-cover"
            fill
            sizes="80px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        </Button>
      );
    }

    if (isPDF) {
      return (
        <Button 
          variant="outline" 
          className="h-20 w-20 flex flex-col items-center justify-center gap-1" 
          onClick={() => handleFileClick(file)}
        >
          <FileText className="h-8 w-8" />
          <Eye className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <Button 
        variant="outline" 
        className="h-20 w-20 flex items-center justify-center" 
        onClick={() => handleFileClick(file)}
      >
        <FileIcon className="h-8 w-8 text-gray-400" />
      </Button>
    );
  };

  const renderPreviewContent = (file: FileUpload) => {
    const isImage = file.fileType?.startsWith('image/');
    const isPDF = file.fileType === 'application/pdf';

    if (isImage) {
      return (
        <div className="relative w-full h-[80vh] bg-black/10 rounded-lg">
          <Image
            src={file.fileUrl}
            alt={file.fileName}
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="w-full h-[80vh] bg-white rounded-lg">
          <iframe
            src={`${file.fileUrl}#toolbar=0`}
            className="w-full h-full rounded-lg"
            title={file.fileName}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileIcon className="h-16 w-16 mb-4" />
        <p>Preview not available for this file type</p>
        <Button 
          className="mt-4" 
          onClick={() => window.open(file.fileUrl, '_blank')}
        >
          Download File
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || "Uploaded Files"}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 rounded-md border p-2">
                <Skeleton className="h-20 w-20" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title || "Uploaded Files"}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              No files uploaded yet
            </div>
          ) : (
            <ul className="space-y-4">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center space-x-4 rounded-md border p-2 hover:bg-accent/50 transition-colors"
                >
                  {renderFilePreview(file)}
                  <div className="min-w-0 flex-grow">
                    <p className="truncate text-sm font-medium">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.fileType || "Unknown type"} • {formatFileSize(file.fileSize)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-11/12">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-8">{selectedFile?.fileName}</span>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedFile && renderPreviewContent(selectedFile)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadedFilesViewer;