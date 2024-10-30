// types/upload.ts
export interface UploadMetadata {
  userId: string;
  category: string;
  entityType: string;
  entityId: string;
  orderNumber?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type?: string;
  key: string;
  url: string;
}
