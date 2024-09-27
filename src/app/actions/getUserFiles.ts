'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type UserFile = {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  category: string;
};

export async function getUserFiles(entityId: string) {
  'use server'

  try {
    const userFiles = await prisma.file_upload.findMany({
      where: {
        entityId: entityId,
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileUrl: true,
        category: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return userFiles;
  } catch (error) {
    console.error('Error fetching entity files:', error);
    throw new Error('Failed to fetch entity files');
  }
}