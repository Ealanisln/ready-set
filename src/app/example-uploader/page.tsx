"use client";

import { useUploadFile } from "@/hooks/use-upload-file";
import { FileUploader } from "@/components/Uploader/file-uploader";
import { UploadedFilesCard } from "@/components/Uploader/uploaded-files-card";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSession } from "next-auth/react";  // Import useSession

export default function Page() {
  const { data: session } = useSession();  // Get the session
  const userId = session?.user?.id;  // Get the user ID from the session

  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "fileUploader",
    { 
      defaultUploadedFiles: [],
      userId: userId,  // Provide the userId
      maxFileCount: 4,
      maxFileSize: 4 * 1024 * 1024,
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    }
  );

  return (
    <div>
      <Breadcrumb pageName="Uploader Page" />
      <FileUploader
        maxFileCount={4}
        maxSize={4 * 1024 * 1024}
        progresses={progresses}
        onUpload={onUpload}
        disabled={isUploading}
        accept={{
          "image/*": [],
          "application/pdf": [],
        }}
      />
      <UploadedFilesCard uploadedFiles={uploadedFiles} />
    </div>
  );
}