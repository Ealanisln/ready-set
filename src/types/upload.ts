// src/types/upload.ts
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface UploadMetadata {
  userId: string; // Keep this required since your DB schema requires it
  category: string;
  entityType: string;
  entityId: string;
  orderNumber?: string;
  [key: string]: any;
}

export interface UploadResult {
  uploadedBy: string;
  fileType: string;
  fileId: string;
  entityType: string;
  category: string;
  [key: string]: any;
}
