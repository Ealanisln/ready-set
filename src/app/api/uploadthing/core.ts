import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  fileUploader: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getServerAuth } = await import('@/server/auth');
      const user = await getServerAuth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { handleUploadComplete } = await import('@/server/upload');
      return handleUploadComplete({ metadata, file });
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;