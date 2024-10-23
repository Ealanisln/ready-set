// pages/api/uploadthing/cleanup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { UTApi } from 'uploadthing/server';

// Initialize the UploadThing API
const utapi = new UTApi();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileKeys } = req.body;

    if (!Array.isArray(fileKeys)) {
      return res.status(400).json({ message: 'Invalid fileKeys format' });
    }

    // Delete the files using the UploadThing API
    await Promise.all(
      fileKeys.map(async (key) => {
        try {
          await utapi.deleteFiles([key]);
        } catch (error) {
          console.error(`Failed to delete file ${key}:`, error);
        }
      })
    );

    return res.status(200).json({ message: 'Files cleaned up successfully' });
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}