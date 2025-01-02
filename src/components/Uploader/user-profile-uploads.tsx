// src/components/Uploader/user-profile-uploads.tsx

import React from "react";
import { FileUploader } from "@/components/Uploader/file-uploader";

interface UploadHook {
  onUpload: (files: File[]) => Promise<void>;
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
}

const driverUploadFields = [
  { name: "driver_photo", label: "Driver Photo" },
  { name: "insurance_photo", label: "Insurance Photo" },
  { name: "vehicle_photo", label: "Vehicle Photo" },
  { name: "license_photo", label: "Driver License Photo" },
];

const generalUploadFields = [{ name: "general_files", label: "User Files" }];

const UserProfileUploads: React.FC<UserProfileUploadsProps> = ({
  uploadHooks,
  userType,
  onUploadSuccess,
}) => {
  const uploadFields =
    userType === "driver" ? driverUploadFields : generalUploadFields;

  const handleUpload = async (hook: UploadHook, files: File[]) => {
    await hook.onUpload(files);
    onUploadSuccess(); // Notify parent on upload success
  };

  return (
    <div>
      {uploadFields.map((field) => {
        const hook = uploadHooks[field.name];
        if (!hook) return null; // Skip if hook is not provided

        return (
          <div key={field.name} className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">{field.label}</h3>
            <FileUploader
              onUpload={(files) => handleUpload(hook, files)}
              progresses={hook.progresses}
              isUploading={hook.isUploading}
              accept={{
                "image/*": [],
                "application/pdf": [],
              }}
              maxSize={3 * 1024 * 1024} // 3MB
              maxFileCount={1}
              category={hook.category}
              entityType={hook.entityType}
              entityId={hook.entityId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default UserProfileUploads;
