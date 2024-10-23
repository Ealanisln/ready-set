// pages/api/files/[entityType]/[entityId].ts
import { prisma } from '@/utils/prismaDB';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { entityType, entityId } = req.query;

  try {
    const files = await prisma.file_upload.findMany({
      where: {
        entityType: entityType as string,
        entityId: entityId as string,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Error fetching files' });
  }
}