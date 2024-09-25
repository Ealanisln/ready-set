import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"; // Import your auth method
import { authOptions } from "@/utils/auth"; // Adjust this import to your auth configuration

const f = createUploadthing();

const prisma = new PrismaClient();

// Define file upload handlers
const handleFileUpload = async ({ metadata, file }: { metadata: { userId: string }, file: { url: string, name: string, size: number } }) => {
  const newFile = await prisma.file_upload.create({
    data: {
      userId: metadata.userId,
      fileName: file.name,
      fileType: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
      fileSize: file.size,
      fileUrl: file.url,
    },
  });

  console.log("File registered in database:", newFile);
  return { uploadedBy: metadata.userId, fileId: newFile.id };
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(handleFileUpload),

  pdfUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(handleFileUpload),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;