// components/OrderFilesManager/index.tsx
import React, { useEffect, useState } from "react";
import { FileUploader } from "@/components/Uploader/file-uploader";
import UploadedFilesViewer from "@/components/Uploader/uploaded-files-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUploadFile } from "@/hooks/use-upload-file";
import { OrderType } from "@/types/order";
import { FileUpload } from "@/types/file";
import { useToast } from "@/components/ui/use-toast";
import FileViewer from "@/components/FileViewer/file-viewer";

interface OrderFilesManagerProps {
  orderNumber: string;
  orderType: OrderType;
  orderId: string;
  initialFiles?: FileUpload[];
}

export function OrderFilesManager({
  orderNumber,
  orderType,
  orderId,
  initialFiles = [],
}: OrderFilesManagerProps) {
  const [allFiles, setAllFiles] = useState<FileUpload[]>(initialFiles);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();

  const { onUpload, uploadedFiles, progresses, isUploading } = useUploadFile(
    "fileUploader",
    {
      defaultUploadedFiles: initialFiles.map((file) => ({
        key: file.id,
        name: file.fileName,
        url: file.fileUrl,
        size: file.fileSize,
        type: file.fileType || "",
        serverData: {
          entityType: file.entityType,
          entityId: file.entityId,
          category: file.category,
        },
      })),
      category: orderType,
      entityType: orderType,
      entityId: orderId,
      maxFileCount: 10,
      maxFileSize: 4 * 1024 * 1024,
      allowedFileTypes: [
        "image/*",
        "application/pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
      ],
    },
  );

  useEffect(() => {
    const fetchFiles = async () => {
      if (!orderNumber) return;

      try {
        setIsLoading(true);
        console.log("Fetching files for order:", orderNumber);

        const response = await fetch(`/api/orders/${orderNumber}/files`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Files fetched:", responseData);

        let filesArray: any[] = [];
        if (Array.isArray(responseData)) {
          filesArray = responseData;
        } else if (responseData && typeof responseData === "object") {
          filesArray = Object.values(responseData);
        } else {
          console.error("Unexpected response format:", responseData);
          throw new Error("Invalid response format");
        }

        const processedFiles = filesArray.map(
          (file: any): FileUpload => ({
            id: file.id || "",
            fileName: file.fileName || "",
            fileType: file.fileType,
            fileSize: file.fileSize || 0,
            fileUrl: file.fileUrl || "",
            entityType: file.entityType || "",
            entityId: file.entityId || "",
            category: file.category,
            uploadedAt: new Date(file.uploadedAt || Date.now()),
            updatedAt: new Date(
              file.updatedAt || file.uploadedAt || Date.now(),
            ),
            userId: file.userId,
            cateringRequestId: file.cateringRequestId,
            onDemandId: file.onDemandId,
          }),
        );

        setAllFiles(processedFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
        toast({
          title: "Error",
          description: "Failed to load files. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [orderNumber, toast]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      console.log("New files uploaded:", uploadedFiles);

      setAllFiles((prev) => {
        const newFiles = [...prev];

        uploadedFiles.forEach((newFile) => {
          const convertedFile: FileUpload = {
            id: newFile.key,
            fileName: newFile.name,
            fileType: newFile.type || null,
            fileSize: newFile.size,
            fileUrl: newFile.url,
            entityType: orderType,
            entityId: orderId,
            category: orderType,
            uploadedAt: new Date(),
            updatedAt: new Date(),
          };

          const existingIndex = newFiles.findIndex(
            (existing) => existing.id === convertedFile.id,
          );
          if (existingIndex !== -1) {
            newFiles[existingIndex] = convertedFile;
          } else {
            newFiles.push(convertedFile);
          }
        });

        return newFiles;
      });
    }
  }, [uploadedFiles, orderType, orderId]);

  const getDisplayText = (type: OrderType): string => {
    switch (type) {
      case "catering":
        return "Catering Request";
      case "on_demand":
        return "On Demand";
      default:
        return "Order";
    }
  };

  const handleUpload = async (files: File[]): Promise<void> => {
    try {
      console.log("Starting upload for files:", files);
      await onUpload(files);
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleFileClick = (file: FileUpload) => {
    if (
      file.fileType?.startsWith("image/") ||
      file.fileType === "application/pdf"
    ) {
      setSelectedFile(file);
      setIsViewerOpen(true);
    } else {
      window.open(file.fileUrl, "_blank");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Order Files</CardTitle>
          <CardDescription>
            {getDisplayText(orderType)} Files - Order #{orderNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploader
            onUpload={handleUpload}
            progresses={progresses}
            isUploading={isUploading}
            category={orderType}
            entityType={orderType}
            entityId={orderId}
            accept={{
              "image/*": [],
              "application/pdf": [".pdf"],
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "application/vnd.ms-excel": [".xls"],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            }}
            maxSize={5 * 1024 * 1024}
            maxFileCount={10}
            multiple={true}
          />

          <UploadedFilesViewer
            files={allFiles}
            title={`${getDisplayText(orderType)} Order Files`}
            description={`Files for Order #${orderNumber}`}
            isLoading={isLoading}
            onFileClick={handleFileClick}
          />
        </CardContent>
      </Card>

      <FileViewer
        file={selectedFile}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedFile(null);
        }}
      />
    </>
  );
}
