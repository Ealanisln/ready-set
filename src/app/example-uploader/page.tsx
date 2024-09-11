"use client";

import { useUploadFile } from "@/hooks/use-upload-file";
import { FileUploader } from "@/components/Uploader/file-uploader";

import { UploadedFilesCard } from "@/components/Uploader/uploaded-files-card";
import Breadcrumb from "@/components/Common/Breadcrumb";

export function BasicUploader() {
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "fileUploader",
    { defaultUploadedFiles: [] },
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

export default BasicUploader;
