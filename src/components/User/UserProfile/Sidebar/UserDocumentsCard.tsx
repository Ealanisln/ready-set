// src/components/User/UserProfile/Sidebar/UserDocumentsCard.tsx

import React from "react";
import { Upload } from "lucide-react";
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
  isUserProfile = false
}: UserDocumentsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
        <CardTitle className="flex items-center text-lg">
          <Upload className="mr-2 h-5 w-5 text-primary" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          {isUserProfile 
            ? "Add required documents to your profile" 
            : "Upload user-specific documents"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
          <UserProfileUploads
            uploadHooks={uploadHooks}
            userType={userType}
            onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)}
            isUserProfile={isUserProfile}
          />

          <div className="px-4 pb-4">
            <div className="mt-2 space-y-2 text-xs text-muted-foreground">
              <p>Supported formats: Images (JPG, PNG, GIF) and PDF</p>
              <p>Maximum file size: 3MB</p>
            </div>

            {isUserProfile && (
              <div className="mt-3 rounded-md bg-blue-50 p-2.5 text-xs text-blue-700">
                <p>Missing or expired documents may affect your account status.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
