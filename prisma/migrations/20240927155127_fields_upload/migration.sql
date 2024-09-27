/*
  Warnings:

  - You are about to drop the column `driverPhotoId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `insurancePhotoId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `licensePhotoId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `vehiclePhotoId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "file_upload" DROP CONSTRAINT "file_upload_userId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_driverPhotoId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_insurancePhotoId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_licensePhotoId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_vehiclePhotoId_fkey";

-- DropIndex
DROP INDEX "user_driverPhotoId_key";

-- DropIndex
DROP INDEX "user_insurancePhotoId_key";

-- DropIndex
DROP INDEX "user_licensePhotoId_key";

-- DropIndex
DROP INDEX "user_vehiclePhotoId_key";

-- AlterTable
ALTER TABLE "file_upload" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "driverPhotoId",
DROP COLUMN "insurancePhotoId",
DROP COLUMN "licensePhotoId",
DROP COLUMN "vehiclePhotoId";

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
