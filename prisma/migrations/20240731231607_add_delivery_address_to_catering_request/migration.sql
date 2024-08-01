/*
  Warnings:

  - Added the required column `delivery_address_id` to the `catering_request` table without a default value. This is not possible if the table is not empty.

*/
-- Add the new column as nullable first
ALTER TABLE "catering_request" ADD COLUMN "delivery_address_id" BIGINT;

-- Update existing rows to use the same address as pickup
UPDATE "catering_request" SET "delivery_address_id" = "address_id";

-- Make the column required
ALTER TABLE "catering_request" ALTER COLUMN "delivery_address_id" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "catering_request" ADD CONSTRAINT "catering_request_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;