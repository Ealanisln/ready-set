/*
  Warnings:

  - The primary key for the `address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `location_number` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `parking_loading` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `vendor` on the `address` table. All the data in the column will be lost.
  - You are about to drop the `failed_job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `migrations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `address` table without a default value. This is not possible if the table is not empty.
  - Made the column `street1` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zip` on table `address` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "catering_request" DROP CONSTRAINT "catering_request_address_id_fkey";

-- DropForeignKey
ALTER TABLE "catering_request" DROP CONSTRAINT "catering_request_delivery_address_id_fkey";

-- DropForeignKey
ALTER TABLE "on_demand" DROP CONSTRAINT "on_demand_address_id_fkey";

-- AlterTable
ALTER TABLE "address" 
DROP CONSTRAINT "address_pkey",
DROP COLUMN "created_at",
DROP COLUMN "location_number",
DROP COLUMN "parking_loading",
DROP COLUMN "status",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
DROP COLUMN "vendor",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "isRestaurant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locationNumber" TEXT,
ADD COLUMN     "parkingLoading" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "county" SET DATA TYPE TEXT,
ALTER COLUMN "street1" SET NOT NULL,
ALTER COLUMN "street1" SET DATA TYPE TEXT,
ALTER COLUMN "street2" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "state" SET DATA TYPE TEXT,
ALTER COLUMN "zip" SET NOT NULL,
ALTER COLUMN "zip" SET DATA TYPE TEXT,
ADD CONSTRAINT "address_pkey" PRIMARY KEY ("id");

DROP SEQUENCE IF EXISTS "address_id_seq";

-- AlterTable
ALTER TABLE "catering_request" ALTER COLUMN "address_id" SET DATA TYPE TEXT,
ALTER COLUMN "delivery_address_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "on_demand" ALTER COLUMN "address_id" SET DATA TYPE TEXT,
ALTER COLUMN "delivery_address_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE IF EXISTS "failed_job";

-- DropTable
DROP TABLE IF EXISTS "migrations";

-- DropEnum
DROP TYPE IF EXISTS "addresses_status";

-- DropEnum
DROP TYPE IF EXISTS "dispatches_service_type";

-- DropEnum
DROP TYPE IF EXISTS "dispatches_user_type";

-- CreateTable
CREATE TABLE "userAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "alias" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userAddress_userId_addressId_key" ON "userAddress"("userId", "addressId");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_request" ADD CONSTRAINT "catering_request_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_request" ADD CONSTRAINT "catering_request_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_demand" ADD CONSTRAINT "on_demand_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;