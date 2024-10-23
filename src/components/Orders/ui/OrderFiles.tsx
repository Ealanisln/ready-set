import React from "react";
import { FileUploader } from "@/components/Uploader/file-uploader";
import { UploadedFilesViewer } from "@/components/Uploader/uploaded-files-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadFile } from "@/hooks/use-upload-file";
import { OrderType } from "@/types/order"; // Import the OrderType from your types

interface OrderFilesManagerProps {
  orderNumber: string;
  orderType: OrderType;
  orderId: string;
  initialFiles: any[];
}

export function OrderFilesManager({
  orderNumber,
  orderType,
  orderId,
  initialFiles = [],
}: OrderFilesManagerProps) {
  const category = orderType;

  const { onUpload, uploadedFiles, progresses, isUploading } = useUploadFile(
    "fileUploader",
    {
      defaultUploadedFiles: initialFiles,
      category: category,
      entityType: category,
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

  // Update the getDisplayText function to match the new OrderType
  const getDisplayText = (type: OrderType) => {
    switch (type) {
      case "catering":  // Updated from "catering_request"
        return "Catering Request";
      case "on_demand":
        return "On Demand";
      default:
        return "Unknown";
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
          onUpload={async (files) => {
            try {
              await onUpload(files);
            } catch (error) {
              console.error("Upload error:", error);
              throw error;
            }
          }}
          progresses={progresses}
          isUploading={isUploading}
          category={category}
          entityType={category}
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
          files={initialFiles}
          title={`${getDisplayText(orderType)} Order Files`}
          description={`Files for Order #${orderNumber}`}
        />
      </CardContent>
    </Card>
  );
}