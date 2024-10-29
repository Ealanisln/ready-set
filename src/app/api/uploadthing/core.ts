// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { handleUploadComplete } from '@/server/upload';

const f = createUploadthing();

// Helper to safely get header values
const getHeaderSafe = (headers: Headers, key: string): string | null => {
  try {
    return headers.get(key);
  } catch (e) {
    console.warn(`Error reading header ${key}:`, e);
    return null;
  }
};

// Helper to log the upload process
const logUploadDetails = (stage: string, details: Record<string, any>) => {
  console.log(`\n=== ${stage} ===`);
  console.log(JSON.stringify(details, null, 2));
  console.log('================\n');
};

// Define metadata type
type UploadMetadata = {
  userId: string;
  category: string;
  entityType: string;
  entityId: string;
  orderNumber?: string;
};

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" }
  })
    .middleware(async ({ req, files }) => {
      try {
        // Log incoming request with headers
        const headers = Object.fromEntries(req.headers.entries());
        logUploadDetails('Upload Request Headers', headers);
        
        logUploadDetails('Upload Request', {
          contentType: getHeaderSafe(req.headers, 'content-type'),
          category: getHeaderSafe(req.headers, 'x-category'),
          entityType: getHeaderSafe(req.headers, 'x-entity-type'),
          entityId: getHeaderSafe(req.headers, 'x-entity-id'),
          orderNumber: getHeaderSafe(req.headers, 'x-order-number'),
          files: files.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type
          }))
        });

        const { getServerAuth } = await import('@/server/auth');
        const user = await getServerAuth(req);
        
        if (!user) {
          throw new UploadThingError("Unauthorized");
        }

        // Extract metadata from headers with more detailed logging
        const category = getHeaderSafe(req.headers, "x-category");
        const entityType = getHeaderSafe(req.headers, "x-entity-type");
        const entityId = getHeaderSafe(req.headers, "x-entity-id");
        const orderNumber = getHeaderSafe(req.headers, "x-order-number");

        console.log('Extracted header values:', { 
          category, 
          entityType, 
          entityId,
          orderNumber 
        });

        const metadata: UploadMetadata = {
          userId: user.id,
          category: category || 'uncategorized',
          entityType: entityType || 'user',
          entityId: entityId || user.id,
          orderNumber: orderNumber || undefined
        };

        logUploadDetails('Middleware Metadata', metadata);

        return metadata;
      } catch (error) {
        console.error('Middleware Error:', error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        logUploadDetails('Pre-Upload Complete', {
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url
          },
          metadata
        });

        // Handle the upload completion
        const result = await handleUploadComplete({ 
          metadata: metadata as UploadMetadata, 
          file 
        });

        logUploadDetails('Post-Upload Complete', {
          result,
          userId: metadata.userId,
          fileUrl: file.url
        });

        return {
          ...result,
          uploadedBy: metadata.userId
        };
      } catch (error) {
        console.error('Upload Complete Error:', error);
        throw new UploadThingError(
          error instanceof Error ? error.message : 'Failed to process upload'
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;