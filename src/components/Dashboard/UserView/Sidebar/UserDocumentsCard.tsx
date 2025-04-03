// src/components/Dashboard/UserView/Sidebar/UserDocumentsCard.tsx

import { FileText, Upload, Trash2, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";
import { UploadHooks, UserFormValues } from "../types";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";

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
  // Get all uploaded files from relevant hooks based on user type
  const allUploadedFiles = Object.entries(uploadHooks).reduce((acc, [hookName, hook]) => {
    // For drivers, include all files
    if (userType === "driver") {
      return [...acc, ...(hook.uploadedFiles || [])];
    }
    // For other users, only include general files
    if (hookName === "general_files") {
      return [...acc, ...(hook.uploadedFiles || [])];
    }
    return acc;
  }, [] as any[]);

  console.log('Upload Hooks:', uploadHooks);
  console.log('All Uploaded Files:', allUploadedFiles);

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch("/api/file-uploads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

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
        {/* Existing Files Section */}
        {allUploadedFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-medium text-slate-700">Uploaded Files</h4>
            <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
              {allUploadedFiles.map((file) => (
                <div key={file.key} className="flex items-center justify-between p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                      {file.category && (
                        <span className="ml-2 text-xs text-slate-400">
                          ({file.category.replace(/_/g, ' ')})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.key)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Section */}
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
          <UserProfileUploads
            uploadHooks={uploadHooks}
            userType={userType}
            onUploadSuccess={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </div>
      </CardContent>
    </Card>
  );
}