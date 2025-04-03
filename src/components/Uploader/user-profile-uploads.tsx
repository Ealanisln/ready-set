// src/components/Uploader/user-profile-uploads.tsx

import React from "react";
import { FileUploader } from "@/components/Uploader/file-uploader";
import { FileWithPath } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";

interface UploadHook {
  onUpload: (files: FileWithPath[]) => Promise<void>;
  progresses: Record<string, number>;
  isUploading: boolean;
  category: string;
  entityType: string;
  entityId: string;
}

interface UserProfileUploadsProps {
  uploadHooks: Record<string, UploadHook>;
  userType:
    | "vendor"
    | "client"
    | "driver"
    | "admin"
    | "helpdesk"
    | "super_admin";
  onUploadSuccess: () => void;
  isUserProfile?: boolean;
}

const driverUploadFields = [
  { 
    name: "driver_photo", 
    label: "Driver Photo",
    description: "Upload a clear photo of yourself for identification purposes."
  },
  { 
    name: "insurance_photo", 
    label: "Insurance Photo",
    description: "Upload your current vehicle insurance documentation."
  },
  { 
    name: "vehicle_photo", 
    label: "Vehicle Photo",
    description: "Upload a photo of your delivery vehicle."
  },
  { 
    name: "license_photo", 
    label: "Driver License Photo",
    description: "Upload a photo of your valid driver's license."
  },
];

const generalUploadFields = [
  { 
    name: "general_files", 
    label: "User Files",
    description: "Upload any relevant documentation for your account."
  }
];

const UserProfileUploads: React.FC<UserProfileUploadsProps> = ({
  uploadHooks,
  userType,
  onUploadSuccess,
  isUserProfile = false
}) => {
  const uploadFields = userType === "driver" 
    ? driverUploadFields 
    : generalUploadFields;

  const handleUpload = async (hook: UploadHook, files: FileWithPath[]) => {
    try {
      await hook.onUpload(files);
      onUploadSuccess();
    } catch (error) {
      console.error("Error in upload:", error);
    }
  };

  return (
    <div className="space-y-4">
      {uploadFields.map((field) => {
        const hook = uploadHooks[field.name];
        if (!hook) return null;

        return (
          <div key={field.name} className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{field.label}</h3>
              <Badge variant="secondary" className="text-xs font-normal">
                {hook.category.replace(/_/g, ' ')}
              </Badge>
              
              {isUserProfile && field.name !== "general_files" && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Required
                </Badge>
              )}
            </div>
            
            <FileUploader
              onUpload={(files) => handleUpload(hook, files as FileWithPath[])}
              progresses={hook.progresses}
              isUploading={hook.isUploading}
              accept={{
                "image/*": [],
                "application/pdf": [],
              }}
              maxSize={3 * 1024 * 1024}
              maxFileCount={1}
              category={hook.category}
              entityType={hook.entityType}
              entityId={hook.entityId}
            >
              <div className="text-center py-6">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  Drag and drop or click to browse
                </p>
              </div>
            </FileUploader>
          </div>
        );
      })}
    </div>
  );
};

export default UserProfileUploads;