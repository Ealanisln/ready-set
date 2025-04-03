-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UsersType" AS ENUM ('vendor', 'client', 'driver', 'admin', 'helpdesk', 'super_admin');

-- CreateEnum
CREATE TYPE "public"."UsersStatus" AS ENUM ('active', 'pending', 'deleted');

-- CreateEnum
CREATE TYPE "public"."DriverStatus" AS ENUM ('arrived_at_vendor', 'en_route_to_client', 'arrived_to_client', 'assigned', 'completed');

-- CreateEnum
CREATE TYPE "public"."CateringRequestsNeedHost" AS ENUM ('yes', 'no');

-- CreateEnum
CREATE TYPE "public"."CateringRequestsStatus" AS ENUM ('active', 'assigned', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "public"."OnDemandStatus" AS ENUM ('active', 'assigned', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "public"."OnDemandVehicleType" AS ENUM ('Car', 'Van', 'Truck');

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "guid" TEXT,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "type" "public"."UsersType" NOT NULL DEFAULT 'vendor',
    "company_name" VARCHAR(191),
    "contact_name" VARCHAR(191),
    "contact_number" VARCHAR(191),
    "website" VARCHAR(191),
    "street1" VARCHAR(191),
    "street2" VARCHAR(191),
    "city" VARCHAR(191),
    "state" VARCHAR(191),
    "zip" VARCHAR(191),
    "location_number" VARCHAR(191),
    "parking_loading" VARCHAR(191),
    "counties" TEXT,
    "time_needed" TEXT,
    "catering_brokerage" TEXT,
    "frequency" TEXT,
    "provide" TEXT,
    "head_count" VARCHAR(191),
    "status" "public"."UsersStatus" NOT NULL DEFAULT 'pending',
    "side_notes" TEXT,
    "confirmation_code" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isTemporaryPassword" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."address" (
    "id" TEXT NOT NULL,
    "county" TEXT,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "isRestaurant" BOOLEAN NOT NULL DEFAULT false,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "locationNumber" TEXT,
    "parkingLoading" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."catering_request" (
    "id" BIGSERIAL NOT NULL,
    "guid" TEXT,
    "user_id" UUID NOT NULL,
    "address_id" TEXT NOT NULL,
    "brokerage" VARCHAR(191),
    "order_number" TEXT NOT NULL,
    "date" DATE,
    "pickup_time" TIME(6),
    "arrival_time" TIME(6),
    "complete_time" TIME(6),
    "headcount" VARCHAR(191),
    "need_host" "public"."CateringRequestsNeedHost" NOT NULL DEFAULT 'no',
    "hours_needed" VARCHAR(191),
    "number_of_host" VARCHAR(191),
    "client_attention" TEXT,
    "pickup_notes" TEXT,
    "special_notes" TEXT,
    "image" TEXT,
    "status" "public"."CateringRequestsStatus" DEFAULT 'active',
    "order_total" DECIMAL(10,2) DEFAULT 0.00,
    "tip" DECIMAL(10,2) DEFAULT 0.00,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_address_id" TEXT NOT NULL,
    "driver_status" "public"."DriverStatus",

    CONSTRAINT "catering_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dispatch" (
    "id" TEXT NOT NULL,
    "cateringRequestId" BIGINT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" UUID,
    "on_demandId" BIGINT,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,

    CONSTRAINT "dispatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file_upload" (
    "id" TEXT NOT NULL,
    "userId" UUID,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cateringRequestId" BIGINT,
    "onDemandId" BIGINT,
    "jobApplicationId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "category" TEXT,
    "isTemporary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "file_upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."on_demand" (
    "id" BIGSERIAL NOT NULL,
    "guid" TEXT,
    "user_id" UUID NOT NULL,
    "address_id" TEXT NOT NULL,
    "order_number" VARCHAR(191) NOT NULL,
    "date" DATE NOT NULL,
    "pickup_time" TIME(6) NOT NULL,
    "arrival_time" TIME(6) NOT NULL,
    "complete_time" TIME(6),
    "hours_needed" VARCHAR(191),
    "item_delivered" VARCHAR(191),
    "vehicle_type" "public"."OnDemandVehicleType" NOT NULL DEFAULT 'Car',
    "client_attention" TEXT NOT NULL,
    "pickup_notes" TEXT,
    "special_notes" TEXT,
    "image" TEXT,
    "status" "public"."OnDemandStatus" NOT NULL DEFAULT 'active',
    "order_total" DECIMAL(10,2) DEFAULT 0.00,
    "tip" DECIMAL(10,2) DEFAULT 0.00,
    "length" VARCHAR(191),
    "width" VARCHAR(191),
    "height" VARCHAR(191),
    "weight" VARCHAR(191),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_address_id" TEXT NOT NULL,
    "driver_status" "public"."DriverStatus",

    CONSTRAINT "on_demand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."userAddress" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "addressId" TEXT NOT NULL,
    "alias" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "public"."profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "public"."profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "public"."account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "public"."session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "catering_request_order_number_key" ON "public"."catering_request"("order_number");

-- CreateIndex
CREATE INDEX "file_upload_entityType_entityId_idx" ON "public"."file_upload"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "on_demand_order_number_key" ON "public"."on_demand"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "userAddress_userId_addressId_key" ON "public"."userAddress"("userId", "addressId");

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."catering_request" ADD CONSTRAINT "catering_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."catering_request" ADD CONSTRAINT "catering_request_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."catering_request" ADD CONSTRAINT "catering_request_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "public"."address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispatch" ADD CONSTRAINT "dispatch_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES "public"."catering_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispatch" ADD CONSTRAINT "dispatch_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispatch" ADD CONSTRAINT "dispatch_on_demandId_fkey" FOREIGN KEY ("on_demandId") REFERENCES "public"."on_demand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dispatch" ADD CONSTRAINT "dispatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_upload" ADD CONSTRAINT "file_upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_upload" ADD CONSTRAINT "file_upload_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES "public"."catering_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_upload" ADD CONSTRAINT "file_upload_onDemandId_fkey" FOREIGN KEY ("onDemandId") REFERENCES "public"."on_demand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."on_demand" ADD CONSTRAINT "on_demand_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."on_demand" ADD CONSTRAINT "on_demand_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."on_demand" ADD CONSTRAINT "on_demand_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "public"."address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userAddress" ADD CONSTRAINT "userAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

