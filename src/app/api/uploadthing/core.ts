// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { handleUploadComplete } from "@/server/upload";
import type { UploadMetadata, UploadResult } from "@/types/upload";

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
const logUploadDetails = (
  stage: string,
  details: Record<string, any>,
): void => {
  console.log(`\n=== ${stage} ===`);
  console.log(JSON.stringify(details, null, 2));
  console.log("================\n");
};

// Check if userId is required for this type of upload
const requiresUserId = (entityType: string, category: string): boolean => {
  // Add any categories or entity types that don't require userId
  const anonymousTypes = ["public", "anonymous", "job_application"];
  const anonymousCategories = [
    "public_files",
    "resume",
    "license",
    "insurance",
    "registration",
  ];

  return (
    !anonymousTypes.includes(entityType) &&
    !anonymousCategories.includes(category)
  );
};

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
  })
    .middleware(async ({ req, files }): Promise<UploadMetadata> => {
      try {
        // Log headers for debugging
        const headers = Object.fromEntries(req.headers.entries());
        logUploadDetails("Upload Request Headers", headers);

        // Extract metadata from headers
        const category =
          getHeaderSafe(req.headers, "x-category") || "uncategorized";
        const entityType =
          getHeaderSafe(req.headers, "x-entity-type") || "user";
        const userId = getHeaderSafe(req.headers, "x-user-id");
        const entityId = getHeaderSafe(req.headers, "x-entity-id");

        // Check if this upload requires userId
        if (requiresUserId(entityType, category)) {
          if (!userId) {
            throw new UploadThingError(
              "UserId is required for this upload type",
            );
          }
        }

        // Construct metadata
        const metadata: UploadMetadata = {
          userId: userId || "anonymous", // Provide a default value for non-authenticated uploads
          category,
          entityType,
          entityId: entityId || `temp_${Date.now()}`,
          orderNumber:
            getHeaderSafe(req.headers, "x-order-number") || undefined,
        };

        logUploadDetails("Upload Request", {
          metadata,
          files: files.map((f) => ({
            name: f.name,
            size: f.size,
            type: f.type,
          })),
        });

        return metadata;
      } catch (error) {
        console.error("Middleware Error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }): Promise<UploadResult> => {
      try {
        logUploadDetails("Pre-Upload Complete", {
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          },
          metadata,
        });

        const result = await handleUploadComplete({
          metadata: metadata as UploadMetadata,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          },
        });

        logUploadDetails("Post-Upload Complete", result);

        return {
          ...result,
          category: result.category || "uncategorized",
        };
      } catch (error) {
        console.error("Upload Complete Error:", error);
        throw new UploadThingError(
          error instanceof Error ? error.message : "Failed to process upload",
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
