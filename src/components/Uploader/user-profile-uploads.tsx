// In UserProfileUploads.tsx
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
}
const uploadFields = [
  { name: "driver_photo", label: "Driver Photo" },
  { name: "insurance_photo", label: "Insurance Photo" },
  { name: "vehicle_photo", label: "Vehicle Photo" },
  { name: "license_photo", label: "Driver License Photo" },
];

const UserProfileUploads: React.FC<UserProfileUploadsProps> = ({
  uploadHooks,
}) => {
  return (
    <div>
      {uploadFields.map((field) => {
        const hook = uploadHooks[field.name];
        if (!hook) return null; // Skip if hook is not provided

        return (
          <div key={field.name} className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">{field.label}</h3>
            <FileUploader
              onUpload={hook.onUpload}
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
