// types/file.ts
export interface FileUpload {
    id: string;
    fileName: string;
    fileType: string | null;
    fileSize: number;
    fileUrl: string;
    entityType: string;
    entityId: string;
    category?: string;
    uploadedAt: Date;
    updatedAt: Date;
    userId?: string;
    cateringRequestId?: number;
    onDemandId?: number;
    isTemporary: boolean;
  }