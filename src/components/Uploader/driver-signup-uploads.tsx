import React, { useState } from "react";
import { useUploadFile } from "@/hooks/use-upload-file";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileWithPath } from "react-dropzone";

interface DriverSignupUploadsProps {
  userId: string;
  onUploadComplete: () => void;
}

const DriverSignupUploads: React.FC<DriverSignupUploadsProps> = ({
  userId,
  onUploadComplete,
}) => {
  const [uploadStatus, setUploadStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  const useUploadFileHook = (category: string) => {
    const {
      onUpload: originalOnUpload,
      progresses,
      isUploading,
    } = useUploadFile({
      bucketName: "fileUploader", // This replaces the first "fileUploader" argument
      defaultUploadedFiles: [],
      userId: userId,
      maxFileCount: 1,
      maxFileSize: 3 * 1024 * 1024,
      allowedFileTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ],
      category: category,
      entityType: "user",
      entityId: userId,
    });

    const onUpload = async (files: FileWithPath[]): Promise<void> => {
      try {
        await originalOnUpload(files);
        setUploadStatus({
          success: true,
          error: false,
          message: `Successfully uploaded ${category}`,
        });
      } catch (error) {
        setUploadStatus({
          success: false,
          error: true,
          message: `Failed to upload ${category}`,
        });
      }
    };

    return {
      onUpload,
      progresses,
      isUploading,
      category,
      entityType: "user",
      entityId: userId,
    };
  };

  const uploadHooks = {
    driver_photo: useUploadFileHook("driver_photo"),
    insurance_photo: useUploadFileHook("insurance_photo"),
    vehicle_photo: useUploadFileHook("vehicle_photo"),
    license_photo: useUploadFileHook("license_photo"),
  };

  const handleUploadSuccess = () => {
    setUploadStatus({
      success: true,
      error: false,
      message: "All required documents uploaded successfully",
    });
    onUploadComplete();
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        {uploadStatus.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        )}
        {uploadStatus.success && (
          <Alert className="mb-4">
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        )}
        <UserProfileUploads
          uploadHooks={uploadHooks}
          userType="driver"
          onUploadSuccess={handleUploadSuccess}
        />
      </CardContent>
    </Card>
  );
};

export default DriverSignupUploads;