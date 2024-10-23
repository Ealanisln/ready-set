import React, { useEffect, useState } from "react";
import { FileUploader } from "@/components/Uploader/file-uploader";
import { UploadedFilesViewer } from "@/components/Uploader/uploaded-files-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadFile, type UploadThingFile } from "@/hooks/use-upload-file";
import { OrderType } from "@/types/order";
import { useToast } from "@/components/ui/use-toast";

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

interface OrderFilesManagerProps {
  orderNumber: string;
  orderType: OrderType;
  orderId: string;
  initialFiles: FileUpload[];
}

export function OrderFilesManager({
  orderNumber,
  orderType,
  orderId,
  initialFiles = [],
}: OrderFilesManagerProps) {
  const [allFiles, setAllFiles] = useState<FileUpload[]>(initialFiles);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { onUpload, uploadedFiles, progresses, isUploading } = useUploadFile(
    "fileUploader",
    {
      defaultUploadedFiles: initialFiles.map(file => ({
        key: file.id,
        name: file.fileName,
        url: file.fileUrl,
        size: file.fileSize,
        type: file.fileType || '',
        serverData: {
          entityType: file.entityType,
          entityId: file.entityId,
          category: file.category
        }
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

  // Fetch files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        let endpoint = '';
        
        // Construct the endpoint based on order type
        if (orderType === 'catering') {
          endpoint = `/api/catering/${orderId}/files`;
        } else if (orderType === 'on_demand') {
          endpoint = `/api/on-demand/${orderId}/files`;
        } else {
          endpoint = `/api/orders/${orderId}/files`;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }

        const data = await response.json();
        // Ensure dates are properly parsed
        const filesWithDates = data.map((file: FileUpload) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt),
          updatedAt: new Date(file.updatedAt)
        }));

        setAllFiles(filesWithDates);
      } catch (error) {
        console.error('Error fetching files:', error);
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
  }, [orderId, orderType, toast]); // Re-fetch if orderId or orderType changes

  // Handle newly uploaded files
  useEffect(() => {
    console.log('uploadedFiles changed:', uploadedFiles);
    if (uploadedFiles.length > 0) {
      setAllFiles(prev => {
        const newFiles = [...prev];
        
        uploadedFiles.forEach(newFile => {
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
            userId: undefined,
            cateringRequestId: orderType === 'catering' ? Number(orderId) : undefined,
            onDemandId: orderType === 'on_demand' ? Number(orderId) : undefined,
          };

          const exists = newFiles.some(existing => existing.fileUrl === convertedFile.fileUrl);
          if (!exists) {
            newFiles.push(convertedFile);
          }
        });
        
        return newFiles;
      });
    }
  }, [uploadedFiles, orderType, orderId]);

  const getDisplayText = (type: OrderType) => {
    switch (type) {
      case "catering":
        return "Catering Request";
      case "on_demand":
        return "On Demand";
      default:
        return "Unknown";
    }
  };

  const handleUpload = async (files: File[], metadata?: { 
    category: string; 
    entityType: string; 
    entityId: string; 
  }): Promise<void> => {
    console.log('Starting upload for files:', files);
    try {
      await onUpload(files);
      console.log('Upload completed');
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  return (
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
        />
      </CardContent>
    </Card>
  );
}