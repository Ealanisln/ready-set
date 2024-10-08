import type { FileRouter } from "uploadthing/next";

export interface UploadMetadata {
  userId: string;
  category: string;
  entityType: string;
  entityId: string;
}
export interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

export type OurFileRouter = FileRouter;