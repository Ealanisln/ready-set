/*
  Warnings:

  - You are about to drop the column `carPhotoUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `driverPhotoUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `driversLicenseUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentPhotoUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `foodHandlerUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `hipaaUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleRegUrl` on the `job_applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job_applications" DROP COLUMN "carPhotoUrl",
DROP COLUMN "driverPhotoUrl",
DROP COLUMN "driversLicenseUrl",
DROP COLUMN "equipmentPhotoUrl",
DROP COLUMN "foodHandlerUrl",
DROP COLUMN "hipaaUrl",
DROP COLUMN "insuranceUrl",
DROP COLUMN "resumeUrl",
DROP COLUMN "vehicleRegUrl",
ADD COLUMN     "carPhotoFilePath" TEXT,
ADD COLUMN     "driverPhotoFilePath" TEXT,
ADD COLUMN     "driversLicenseFilePath" TEXT,
ADD COLUMN     "equipmentPhotoFilePath" TEXT,
ADD COLUMN     "foodHandlerFilePath" TEXT,
ADD COLUMN     "hipaaFilePath" TEXT,
ADD COLUMN     "insuranceFilePath" TEXT,
ADD COLUMN     "resumeFilePath" TEXT,
ADD COLUMN     "vehicleRegFilePath" TEXT,
ALTER COLUMN "education" DROP NOT NULL,
ALTER COLUMN "workExperience" DROP NOT NULL,
ALTER COLUMN "skills" DROP NOT NULL;
