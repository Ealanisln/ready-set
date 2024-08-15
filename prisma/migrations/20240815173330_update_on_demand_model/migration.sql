/*
  Warnings:

  - Added the required column `delivery_address_id` to the `on_demand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "on_demand" ADD COLUMN     "delivery_address_id" BIGINT NOT NULL;
