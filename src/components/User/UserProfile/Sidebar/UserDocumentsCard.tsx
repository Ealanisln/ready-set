// src/components/User/UserProfile/Sidebar/UserDocumentsCard.tsx

import React, { useCallback, useRef } from "react";
import { FileText, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserProfileUploads from "@/components/Uploader/user-profile-uploads";
import { UploadHooks, UserFormValues } from "../types";

interface UserDocumentsCardProps {
  uploadHooks: UploadHooks;
  userType: Exclude<UserFormValues["type"], null>;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
  isUserProfile?: boolean; // New prop for user profile view
}

export default function UserDocumentsCard({
  uploadHooks,
  userType,
  setRefreshTrigger,
  isUserProfile = false // Default to admin view
}: UserDocumentsCardProps) {
  // Track the last time a refresh was triggered
  // const lastRefreshTimeRef = useRef<number>(0); // Removed
  
  // Create a debounced version of setRefreshTrigger to avoid multiple calls
  // const debouncedSetRefreshTrigger = useCallback(() => { // Removed
    // Prevent multiple refreshes within 5 seconds
    // const now = Date.now();
    // if (now - lastRefreshTimeRef.current < 5000) {
      // console.log("Skipping document refresh - too soon");
      // return;
    // }
    
    // Update the last refresh time
    // lastRefreshTimeRef.current = now;
    
    // Use a timeout to batch multiple uploads into a single refresh
    // setTimeout(() => {
      // setRefreshTrigger(prev => prev + 1);
    // }, 300);
  // }, [setRefreshTrigger]); // Removed

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          User Documents
        </CardTitle>
        <CardDescription>
          {isUserProfile 
            ? "View and upload your documents" 
            : "Upload and manage user-specific documents"}
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
              {isUserProfile 
                ? "Upload required documents to your profile"
                : "Drag and drop files or click to browse"}
            </p>
          </div>
          {/* Pass isUserProfile prop to the UserProfileUploads component */}
          <UserProfileUploads
            uploadHooks={uploadHooks}
            userType={userType}
            onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)}
            isUserProfile={isUserProfile}
          />

          {/* Additional guidance for user profile view */}
          {isUserProfile && (
            <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
              <p>Please upload all required documents. Missing or expired documents may affect your account status.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
