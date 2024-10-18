import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  orderAttachment: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
  })
    .middleware(async ({ req }) => {
      const { getServerAuth } = await import("@/server/auth");
      const user = await getServerAuth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      // Extract custom headers using the get method
      const category = req.headers.get("x-category");
      const entityType = req.headers.get("x-entity-type");
      const entityId = req.headers.get("x-entity-id");

      if (!category || !entityType || !entityId) {
        throw new UploadThingError("Missing required metadata");
      }

      return {
        userId: user.id,
        category,
        entityType,
        entityId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { handleUploadComplete } = await import("@/server/upload");
      const result = await handleUploadComplete({ metadata, file });
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("Associated with:", metadata.entityType, metadata.entityId);
      return { ...result, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
