import Image from "next/image";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileType,
  Loader2,
  FileTextIcon,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

interface FileUpload {
  id: string;
  fileName: string;
  fileType: string | null;
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
  isLoading?: boolean;
}

export function UploadedFilesViewer({
  files,
  title = "Uploaded Files",
  description = "View uploaded files",
  isLoading = false,
}: UploadedFilesViewerProps) {
  const isImage = (fileType: string | null | undefined): boolean => {
    if (!fileType) return false;
    return (
      fileType.toLowerCase().startsWith("image") ||
      fileType.toLowerCase() === "image" ||
      ["jpg", "jpeg", "png", "gif", "webp"].some((ext) =>
        fileType.toLowerCase().includes(ext),
      )
    );
  };

  const isPDF = (fileType: string | null | undefined): boolean => {
    if (!fileType) return false;
    return (
      fileType.toLowerCase() === "pdf" ||
      fileType.toLowerCase().includes("pdf") ||
      fileType.toLowerCase() === "application/pdf"
    );
  };

  const isSpreadsheet = (fileType: string | null | undefined): boolean => {
    if (!fileType) return false;
    return (
      ["xls", "xlsx", "csv", "numbers"].some((ext) =>
        fileType.toLowerCase().includes(ext),
      ) || fileType.toLowerCase().includes("spreadsheet")
    );
  };

  const getFileIcon = (file: FileUpload) => {
    if (isImage(file.fileType)) {
      return (
        <div className="relative h-16 w-16 overflow-hidden rounded-md">
          <Image
            src={file.fileUrl}
            alt={file.fileName}
            fill
            className="object-cover"
          />
        </div>
      );
    }

    if (isPDF(file.fileType)) {
      return (
        <FileTextIcon
          className="h-10 w-10 text-red-500"
          aria-label="PDF file"
        />
      );
    }

    if (isSpreadsheet(file.fileType)) {
      return (
        <FileSpreadsheet
          className="h-10 w-10 text-green-500"
          aria-label="Spreadsheet file"
        />
      );
    }

    if (file.fileType?.toLowerCase().includes("document")) {
      return (
        <FileText
          className="h-10 w-10 text-blue-500"
          aria-label="Document file"
        />
      );
    }

    return (
      <FileType
        className="text-muted-foreground h-10 w-10"
        aria-label="Generic file"
      />
    );
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    window.open(fileUrl, "_blank");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-9 w-[100px]" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <EmptyCard
      title="No files available"
      description="No files have been uploaded yet"
      className="w-full"
    />
  );

  const renderFileList = () => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-center gap-4">
              {getFileIcon(file)}
              <div className="flex flex-col">
                <p className="line-clamp-1 font-medium">{file.fileName}</p>
                <div className="text-muted-foreground flex gap-2 text-sm">
                  <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{formatFileSize(file.fileSize)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(file.fileUrl, file.fileName)}
              className="ml-4"
            >
              Download
            </Button>
          </div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {isLoading && (
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading
          ? renderLoadingState()
          : files && files.length > 0
            ? renderFileList()
            : renderEmptyState()}
      </CardContent>
    </Card>
  );
}
