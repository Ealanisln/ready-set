// src/components/Dashboard/UserView/Sidebar/UserDocumentsCard.tsx

import { FileText, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";
import { UploadHooks, UserFormValues } from "../types";

interface UserDocumentsCardProps {
  uploadHooks: UploadHooks;
  userType: Exclude<UserFormValues["type"], null>;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
  isUserProfile?: boolean;
}

export default function UserDocumentsCard({
  uploadHooks,
  userType,
  setRefreshTrigger,
  isUserProfile
}: UserDocumentsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          User Documents
        </CardTitle>
        <CardDescription>
          Upload and manage user-specific documents
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-700">
              Upload Files
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Drag and drop files or click to browse
            </p>
          </div>
          {/* Only render the component when type is available or provide a default value */}
          <UserProfileUploads
            uploadHooks={uploadHooks}
            userType={userType}
            onUploadSuccess={() =>
              setRefreshTrigger((prev) => prev + 1)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}