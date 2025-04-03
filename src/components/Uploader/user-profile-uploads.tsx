// src/components/Uploader/user-profile-uploads.tsx

import React from "react";
import { FileUploader } from "@/components/Uploader/file-uploader";
import { FileWithPath } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

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
  isUserProfile?: boolean; // Add this prop to the interface
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
  isUserProfile = false, // Add default value
}) => {
  // Select the appropriate upload fields based on user type
  const uploadFields = userType === "driver" 
    ? driverUploadFields 
    : generalUploadFields;

  const handleUpload = async (hook: UploadHook, files: FileWithPath[]) => {
    try {
      await hook.onUpload(files);
      onUploadSuccess(); // Notify parent on upload success
    } catch (error) {
      console.error("Error in upload:", error);
      // Error handling is managed by the hook itself
    }
  };

  return (
    <div className="space-y-6">
      {uploadFields.map((field) => {
        const hook = uploadHooks[field.name];
        if (!hook) return null; // Skip if hook is not provided

        return (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium">{field.label}</h3>
              <Badge variant="secondary" className="text-xs font-normal">
                {hook.category.replace(/_/g, ' ')}
              </Badge>
              
              {/* Conditional rendering based on isUserProfile */}
              {isUserProfile && field.name !== "general_files" && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Required
                </Badge>
              )}
            </div>
            
            {field.description && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  {isUserProfile && field.name === "license_photo" 
                    ? "Please ensure your license is valid and not expired." 
                    : field.description}
                </p>
              </div>
            )}
            
            <FileUploader
              onUpload={(files) => handleUpload(hook, files as FileWithPath[])}
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
      
      <div className="text-xs text-muted-foreground mt-4">
        <p>Supported file types: Images (JPG, PNG, GIF) and PDF</p>
        <p>Maximum file size: 3MB</p>
        
        {/* Additional instructions for user profile */}
        {isUserProfile && userType === "driver" && (
          <p className="text-amber-600 mt-1">
            Driver documents must be approved before you can accept deliveries
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfileUploads;