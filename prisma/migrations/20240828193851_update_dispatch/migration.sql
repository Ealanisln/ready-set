/*
  Warnings:

  - The primary key for the `dispatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `driver_id` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `service_type` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `dispatch` table. All the data in the column will be lost.
  - You are about to drop the column `user_type` on the `dispatch` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT IF EXISTS "dispatch_catering_request_fkey";
ALTER TABLE "dispatch" DROP CONSTRAINT IF EXISTS "dispatch_driver_id_fkey";
ALTER TABLE "dispatch" DROP CONSTRAINT IF EXISTS "dispatch_on_demand_fkey";
ALTER TABLE "dispatch" DROP CONSTRAINT IF EXISTS "dispatch_user_id_fkey";

-- AlterTable
ALTER TABLE "dispatch"
-- First, drop the old primary key constraint
DROP CONSTRAINT IF EXISTS "idx_16494_primary",
-- Then, drop columns
DROP COLUMN IF EXISTS "created_at",
DROP COLUMN IF EXISTS "driver_id",
DROP COLUMN IF EXISTS "service_id",
DROP COLUMN IF EXISTS "service_type",
DROP COLUMN IF EXISTS "updated_at",
DROP COLUMN IF EXISTS "user_id",
DROP COLUMN IF EXISTS "user_type",
-- Next, add new columns
ADD COLUMN IF NOT EXISTS "cateringRequestId" BIGINT,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "driverId" TEXT,
ADD COLUMN IF NOT EXISTS "on_demandId" BIGINT,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "userId" TEXT,
-- Alter the id column
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
-- Finally, add the new primary key constraint
ADD CONSTRAINT "dispatch_pkey" PRIMARY KEY ("id");

-- Drop the sequence if it exists
DROP SEQUENCE IF EXISTS "dispatch_id_seq";

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES "catering_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_on_demandId_fkey" FOREIGN KEY ("on_demandId") REFERENCES "on_demand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
