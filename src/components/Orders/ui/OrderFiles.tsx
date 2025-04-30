// components/Orders/ui/OrderFiles/index.tsx
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
import { FileWithPath } from "react-dropzone";

interface OrderFilesManagerProps {
  orderNumber: string;
  order_type: OrderType;
  orderId: string;
  initialFiles?: FileUpload[];
}

export function OrderFilesManager({
  orderNumber,
  order_type,
  orderId,
  initialFiles = [],
}: OrderFilesManagerProps) {
  const [allFiles, setAllFiles] = useState<FileUpload[]>(initialFiles);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();

  // Create an array of file data for the useUploadFile hook
  const safeInitialFiles = initialFiles.map((file) => ({
    key: file.id,
    name: file.fileName,
    url: file.fileUrl,
    size: file.fileSize,
    type: file.fileType || "",
    entityId: file.entityId,
    category: file.category || order_type,
  }));

  // Updated to use single object parameter
  const { 
    onUpload, 
    uploadedFiles, 
    progresses, 
    isUploading 
  } = useUploadFile({
    bucketName: "fileUploader",
    defaultUploadedFiles: safeInitialFiles,
    category: order_type,
    entityType: order_type,
    entityId: orderId,
    maxFileCount: 10,
    maxFileSize: 4 * 1024 * 1024,
    allowedFileTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  });

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

        const processedFiles = filesArray.map((file: any): FileUpload => {
          // Ensure all required fields are present with proper types
          return {
            id: file.id || "",
            fileName: file.fileName || "",
            fileType: file.fileType || null,
            fileSize: typeof file.fileSize === 'number' ? file.fileSize : 0,
            fileUrl: file.fileUrl || "",
            entityType: file.entityType || order_type,
            entityId: file.entityId || orderId,
            category: file.category, // Optional field
            uploadedAt: new Date(file.uploadedAt || Date.now()),
            updatedAt: new Date(file.updatedAt || file.uploadedAt || Date.now()),
            userId: file.userId, // Optional field
            cateringRequestId: typeof file.cateringRequestId === 'number' ? file.cateringRequestId : undefined,
            onDemandId: typeof file.onDemandId === 'number' ? file.onDemandId : undefined,
            isTemporary: file.isTemporary || false,
          };
        });

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
  }, [orderNumber, orderId, order_type, toast]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      console.log("New files uploaded:", uploadedFiles);

      setAllFiles((prev) => {
        const newFiles = [...prev];

        uploadedFiles.forEach((newFile) => {
          // Create a FileUpload object that matches your schema
          const convertedFile: FileUpload = {
            id: newFile.key,
            fileName: newFile.name,
            fileType: newFile.type || null,
            fileSize: newFile.size,
            fileUrl: newFile.url,
            entityType: order_type,
            entityId: orderId,
            category: newFile.category || order_type,
            uploadedAt: new Date(),
            updatedAt: new Date(),
            isTemporary: false,
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
  }, [uploadedFiles, order_type, orderId]);

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

  // Updated handleUpload function to use FileWithPath
  const handleUpload = async (files: FileWithPath[]): Promise<void> => {
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
        description: error instanceof Error 
          ? error.message 
          : "Failed to upload files. Please try again.",
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
        <CardHeader>
          <CardDescription className="text-lg">
            {getDisplayText(order_type)}  #{orderNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploader
            onUpload={handleUpload}
            progresses={progresses}
            isUploading={isUploading}
            category={order_type}
            entityType={order_type}
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
            isLoading={isLoading} 
            onFileClick={handleFileClick}
          />
        </CardContent>
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