import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FileData {
  name: string;
  size: number;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { files, userId } = await request.json();

    const savedFiles = await Promise.all(
      files.map(async (file: FileData) => {
        const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';

        // Check for existing file
        const existingFile = await prisma.file_upload.findFirst({
          where: {
            userId: userId,
            fileName: file.name,
            fileUrl: file.url,
          },
        });

        if (existingFile) {
          console.log("File already exists in database:", existingFile);
          return existingFile;
        }

        // Create new file entry
        const newFile = await prisma.file_upload.create({
          data: {
            userId: userId,
            fileName: file.name,
            fileType: fileType,
            fileSize: file.size,
            fileUrl: file.url,
          },
        });

        console.log("File registered in database:", newFile);
        return newFile;
      })
    );

    return NextResponse.json(savedFiles, { status: 200 });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ message: 'Error processing upload' }, { status: 500 });
  }
}