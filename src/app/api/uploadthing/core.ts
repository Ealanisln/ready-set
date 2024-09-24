import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getServerAuth } = await import('@/server/auth');
      const user = await getServerAuth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { handleUploadComplete } = await import('@/server/upload');
      const result = await handleUploadComplete({ metadata, file });
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { ...result, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;