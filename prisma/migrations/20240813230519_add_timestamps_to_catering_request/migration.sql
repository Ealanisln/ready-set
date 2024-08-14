/*
  Warnings:

  - A unique constraint covering the columns `[order_number]` on the table `catering_request` will be added. If there are existing duplicate values, this will fail.
  - Made the column `order_number` on table `catering_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `catering_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `catering_request` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "catering_request" ALTER COLUMN "order_number" SET NOT NULL,
ALTER COLUMN "order_number" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "catering_request_order_number_key" ON "catering_request"("order_number");
