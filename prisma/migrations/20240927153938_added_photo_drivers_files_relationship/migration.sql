/*
  Warnings:

  - You are about to drop the column `photo_insurance` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `photo_license` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `photo_vehicle` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[driverPhotoId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehiclePhotoId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licensePhotoId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[insurancePhotoId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "photo_insurance",
DROP COLUMN "photo_license",
DROP COLUMN "photo_vehicle",
ADD COLUMN     "driverPhotoId" TEXT,
ADD COLUMN     "insurancePhotoId" TEXT,
ADD COLUMN     "licensePhotoId" TEXT,
ADD COLUMN     "vehiclePhotoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_driverPhotoId_key" ON "user"("driverPhotoId");

-- CreateIndex
CREATE UNIQUE INDEX "user_vehiclePhotoId_key" ON "user"("vehiclePhotoId");

-- CreateIndex
CREATE UNIQUE INDEX "user_licensePhotoId_key" ON "user"("licensePhotoId");

-- CreateIndex
CREATE UNIQUE INDEX "user_insurancePhotoId_key" ON "user"("insurancePhotoId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_driverPhotoId_fkey" FOREIGN KEY ("driverPhotoId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_vehiclePhotoId_fkey" FOREIGN KEY ("vehiclePhotoId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_licensePhotoId_fkey" FOREIGN KEY ("licensePhotoId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_insurancePhotoId_fkey" FOREIGN KEY ("insurancePhotoId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
