import { PrismaClient } from "@prisma/client";
import type { UploadMetadata, UploadedFile } from "@/types/upload";

const prisma = new PrismaClient();

export interface UploadCompleteParams {
  metadata: UploadMetadata;
  file: UploadedFile;
}

const FILE_TYPE_MAPPING: Record<string, string> = {
  pdf: "pdf",
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  txt: "text",
  doc: "text",
  docx: "text",
};

function getFileType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return FILE_TYPE_MAPPING[extension] || "other";
}

function safelyConvertToBigInt(
  value: string | number | undefined,
): bigint | undefined {
  if (!value) return undefined;

  try {
    // Remove any non-numeric characters and leading/trailing whitespace
    const sanitizedValue = String(value)
      .trim()
      .replace(/[^0-9]/g, "");
    return sanitizedValue ? BigInt(sanitizedValue) : undefined;
  } catch (error) {
    console.warn(`Failed to convert value to BigInt: ${value}`, error);
    return undefined;
  }
}

export async function handleUploadComplete({
  metadata,
  file,
}: UploadCompleteParams) {
  console.log("Upload complete for userId:", metadata.userId);
  console.log("file url", file.url);

  try {
    const existingFile = await prisma.file_upload.findFirst({
      where: {
        userId: metadata.userId,
        fileName: file.name,
        fileUrl: file.url,
      },
    });

    if (existingFile) {
      console.log("File already exists in database:", existingFile);
      return {
        uploadedBy: metadata.userId,
        fileType: existingFile.fileType,
        fileId: existingFile.id,
        entityType: existingFile.entityType,
        category: existingFile.category,
      };
    }

    // Create file without relationships first
    const newFileUpload = await prisma.file_upload.create({
      data: {
        userId: metadata.userId,
        fileName: file.name,
        fileType: getFileType(file.name),
        fileSize: file.size,
        fileUrl: file.url,
        entityType: metadata.entityType || "user",
        entityId: metadata.entityId || metadata.userId,
        category: metadata.category,
        uploadedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("File registered in database:", newFileUpload);

    return {
      uploadedBy: metadata.userId,
      fileType: newFileUpload.fileType,
      fileId: newFileUpload.id,
      entityType: newFileUpload.entityType,
      category: newFileUpload.category,
    };
  } catch (error) {
    console.error("Error saving file to database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
