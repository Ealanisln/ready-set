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

  // Determine file type based on file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  let fileType = 'other';
  
  if (fileExtension === 'pdf') {
    fileType = 'pdf';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
    fileType = 'image';
  } else if (['txt', 'doc', 'docx'].includes(fileExtension || '')) {
    fileType = 'text';
  }

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
      return {
        uploadedBy: metadata.userId,
        fileType: existingFile.fileType,
        fileId: existingFile.id,
        entityType: existingFile.entityType,
        category: existingFile.category
      };
    }

    // Prepare the base data
    const baseData = {
      id: undefined, // Let Prisma handle CUID generation
      userId: metadata.userId,
      fileName: file.name,
      fileType: fileType,
      fileSize: file.size,
      fileUrl: file.url,
      entityType: metadata.entityType || 'user',
      entityId: metadata.entityId || metadata.userId,
      category: metadata.category,
      uploadedAt: new Date(), // Schema uses uploadedAt instead of createdAt
      updatedAt: new Date()
    };

    // Add relationship data based on entity type
    const relationshipData = (() => {
      if (metadata.entityType === 'catering_request' && metadata.entityId) {
        return { cateringRequestId: BigInt(metadata.entityId) };
      }
      if (metadata.entityType === 'on_demand' && metadata.entityId) {
        return { onDemandId: BigInt(metadata.entityId) };
      }
      return {};
    })();

    const newFileUpload = await prisma.file_upload.create({
      data: {
        ...baseData,
        ...relationshipData,
      },
    });

    console.log("File registered in database:", newFileUpload);

    return {
      uploadedBy: metadata.userId,
      fileType: newFileUpload.fileType,
      fileId: newFileUpload.id,
      entityType: newFileUpload.entityType,
      category: newFileUpload.category
    };
  } catch (error) {
    console.error("Error saving file to database:", error);
    throw new Error("Failed to save file information");
  } finally {
    await prisma.$disconnect();
  }
}