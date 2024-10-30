import { UTApi } from 'uploadthing/server';
import { prisma } from '@/utils/prismaDB';

const utapi = new UTApi();

// Updated interface to exactly match UploadThing v7's response type
interface UploadThingFile {
  name: string;
  customId: string | null;
  key: string;
  status: "Deletion Pending" | "Failed" | "Uploaded" | "Uploading";
  id: string;
}

export async function cleanupOrphanedUploads() {
  const BATCH_SIZE = 100;
  let successCount = 0;
  let errorCount = 0;

  try {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log(`Starting cleanup of files older than ${cutoffTime.toISOString()}`);

    let allFiles: UploadThingFile[] = [];
    try {
      const response = await utapi.listFiles();
      allFiles = [...response.files];
      console.log(`Retrieved ${allFiles.length} files from UploadThing`);
    } catch (error) {
      console.error('Error fetching files from UploadThing:', error);
      return;
    }

    let submittedFileKeys: string[] = [];
    try {
      const fileUploads = await prisma.file_upload.findMany({
        select: {
          fileUrl: true,
          entityType: true,
          entityId: true,
          uploadedAt: true,
        },
        where: {
          OR: [
            { cateringRequestId: { not: null } },
            { onDemandId: { not: null } }
          ],
        },
      });

      submittedFileKeys = fileUploads.map(file => {
        const urlParts = file.fileUrl.split('/');
        return urlParts[urlParts.length - 1];
      });
    } catch (error) {
      console.error('Error fetching submitted file keys from database:', error);
      return;
    }

    const validKeys = new Set(submittedFileKeys);

    const orphanedFiles = allFiles.filter(file => {
      try {
        return (
          file.status === "Uploaded" &&
          !validKeys.has(file.key)
        );
      } catch (error) {
        console.error(`Error processing file ${file.key}:`, error);
        return false;
      }
    });

    if (orphanedFiles.length === 0) {
      console.log('No orphaned files found');
      return;
    }

    console.log(`Found ${orphanedFiles.length} orphaned files to clean up`);

    for (let i = 0; i < orphanedFiles.length; i += BATCH_SIZE) {
      const batch = orphanedFiles.slice(i, i + BATCH_SIZE);
      const batchKeys = batch.map(file => file.key);

      try {
        await utapi.deleteFiles(batchKeys);
        successCount += batch.length;
        console.log(`Successfully deleted batch of ${batch.length} files`);

        // Construct the URLs for database cleanup
        // You might need to adjust this URL construction based on your UploadThing configuration
        const fileUrls = batch.map(file => `https://uploadthing.com/f/${file.key}`);

        await prisma.file_upload.deleteMany({
          where: {
            fileUrl: {
              in: fileUrls
            },
            AND: {
              cateringRequestId: null,
              onDemandId: null
            }
          }
        });

      } catch (error) {
        errorCount += batch.length;
        console.error(`Error deleting batch starting with key ${batchKeys[0]}:`, error);
      }

      if (i + BATCH_SIZE < orphanedFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Cleanup completed. Successfully deleted ${successCount} files, failed to delete ${errorCount} files`);

  } catch (error) {
    console.error('Error in cleanupOrphanedUploads:', error);
  }
}

export async function triggerCleanup() {
  console.log('Manually triggering orphaned files cleanup...');
  await cleanupOrphanedUploads();
  console.log('Cleanup process completed');
}