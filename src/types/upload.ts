// types/file.ts
// Updated based on Prisma Schema provided on 2025-04-03
// NOTE: Ideally, import this from a central types file

export interface FileUpload {
  id: string; // Prisma: String @id
  fileName: string; // Prisma: String
  fileType: string; // Prisma: String
  fileSize: number; // Prisma: Int
  fileUrl: string; // Prisma: String
  // entityType: string; // Removed, use specific relation IDs
  // entityId: string; // Removed, use specific relation IDs
  category?: string | null; // Prisma: String? - Made explicitly nullable
  uploadedAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  updatedAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  userId?: string | null; // Prisma: String? @db.Uuid
  // Relation IDs are Strings (UUIDs) in Prisma
  cateringRequestId?: string | null; // Prisma: String? @db.Uuid
  onDemandId?: string | null; // Prisma: String? @db.Uuid
  jobApplicationId?: string | null; // Prisma: String? @db.Uuid (Added from schema)
  isTemporary: boolean; // Prisma: Boolean (Added from schema)
}