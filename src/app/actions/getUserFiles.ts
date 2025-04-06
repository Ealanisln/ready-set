// src/app/actions/getUserFiles.ts

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

  console.log('Server action - getUserFiles called with entityId:', entityId);

  try {
    // Verify that entityId exists and is not empty
    if (!entityId) {
      console.error('EntityId is empty or undefined');
      return [];
    }

    // Log the query parameters
    console.log('Query parameters:', { entityId, entityType: 'user' });

    // Try to find files with both entityId and entityType
    const userFiles = await prisma.fileUpload.findMany({
      where: {
        userId: entityId,
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

    console.log(`Found ${userFiles.length} files for entity ${entityId}`);
    console.log('Files:', userFiles);

    return userFiles;
  } catch (error) {
    console.error('Error fetching entity files:', error);
    throw new Error('Failed to fetch entity files');
  }
}