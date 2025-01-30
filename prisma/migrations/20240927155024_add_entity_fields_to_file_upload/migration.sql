-- Step 1: Add new columns as nullable
ALTER TABLE "file_upload" ADD COLUMN "entityType" TEXT;
ALTER TABLE "file_upload" ADD COLUMN "entityId" TEXT;

-- Step 2: Update existing rows
-- Assuming all existing files are related to users
UPDATE "file_upload"
SET "entityType" = 'user',
    "entityId" = "userId"
WHERE "entityType" IS NULL AND "entityId" IS NULL;

-- Step 3: Make the new columns non-nullable
ALTER TABLE "file_upload" ALTER COLUMN "entityType" SET NOT NULL;
ALTER TABLE "file_upload" ALTER COLUMN "entityId" SET NOT NULL;

-- Step 4: Add the index
CREATE INDEX "file_upload_entityType_entityId_idx" ON "file_upload"("entityType", "entityId");

-- Step 5: Add the category column (nullable)
ALTER TABLE "file_upload" ADD COLUMN "category" TEXT;

-- You may want to update categories for existing rows here
-- For example:
UPDATE "file_upload"
SET "category" = 
  CASE 
    WHEN "id" = (SELECT "driverPhotoId" FROM "user" WHERE "driverPhotoId" = "file_upload"."id") THEN 'driver_photo'
    WHEN "id" = (SELECT "vehiclePhotoId" FROM "user" WHERE "vehiclePhotoId" = "file_upload"."id") THEN 'vehicle_photo'
    WHEN "id" = (SELECT "licensePhotoId" FROM "user" WHERE "licensePhotoId" = "file_upload"."id") THEN 'license_photo'
    WHEN "id" = (SELECT "insurancePhotoId" FROM "user" WHERE "insurancePhotoId" = "file_upload"."id") THEN 'insurance_photo'
    ELSE NULL
  END;