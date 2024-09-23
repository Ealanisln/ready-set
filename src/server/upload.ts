import { PrismaClient } from '@prisma/client';
import { UploadMetadata, UploadedFile } from '@/types/upload';

const prisma = new PrismaClient();

interface UploadCompleteParams {
  metadata: UploadMetadata;
  file: UploadedFile;
}

export async function handleUploadComplete({ metadata, file }: UploadCompleteParams) {
  console.log("Upload complete for userId:", metadata.userId);
  console.log("file url", file.url);

  const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'image';

  try {
    // Check if a file with the same name and user ID already exists
    const existingFile = await prisma.file_upload.findFirst({
      where: {
        userId: metadata.userId,
        fileName: file.name,
        fileUrl: file.url,
      },
    });

    if (existingFile) {
      console.log("File already exists in database:", existingFile);
      return { uploadedBy: metadata.userId, fileType: fileType, fileId: existingFile.id };
    }

    const newFileUpload = await prisma.file_upload.create({
      data: {
        userId: metadata.userId,
        fileName: file.name,
        fileType: fileType,
        fileSize: file.size,
        fileUrl: file.url,
      },
    });

    console.log("File registered in database:", newFileUpload);

    return { uploadedBy: metadata.userId, fileType: fileType, fileId: newFileUpload.id };
  } catch (error) {
    console.error("Error saving file to database:", error);
    throw new Error("Failed to save file information");
  }
}