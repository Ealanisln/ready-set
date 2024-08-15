/*
  Warnings:

  - A unique constraint covering the columns `[order_number]` on the table `on_demand` will be added. If there are existing duplicate values, this will fail.
  - Made the column `order_number` on table `on_demand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `on_demand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickup_time` on table `on_demand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `arrival_time` on table `on_demand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `client_attention` on table `on_demand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `on_demand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `on_demand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `on_demand` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "on_demand" ALTER COLUMN "order_number" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "pickup_time" SET NOT NULL,
ALTER COLUMN "arrival_time" SET NOT NULL,
ALTER COLUMN "client_attention" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "on_demand_order_number_key" ON "on_demand"("order_number");
