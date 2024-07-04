-- CreateEnum
CREATE TYPE "addresses_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "catering_requests_need_host" AS ENUM ('yes', 'no');

-- CreateEnum
CREATE TYPE "catering_requests_status" AS ENUM ('active', 'assigned', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "dispatches_service_type" AS ENUM ('catering', 'ondemand');

-- CreateEnum
CREATE TYPE "dispatches_user_type" AS ENUM ('vendor', 'client');

-- CreateEnum
CREATE TYPE "on_demand_status" AS ENUM ('active', 'assigned', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "on_demand_vehicle_type" AS ENUM ('Car', 'Van', 'Truck');

-- CreateEnum
CREATE TYPE "users_status" AS ENUM ('active', 'pending', 'deleted');

-- CreateEnum
CREATE TYPE "users_type" AS ENUM ('vendor', 'client', 'driver', 'admin');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "guid" TEXT,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetTokenExp" TIMESTAMP(3),
    "type" "users_type" NOT NULL DEFAULT 'vendor',
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
    "photo_vehicle" TEXT,
    "photo_license" TEXT,
    "photo_insurance" TEXT,
    "status" "users_status" NOT NULL DEFAULT 'pending',
    "side_notes" TEXT,
    "confirmation_code" TEXT,
    "remember_token" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "county" VARCHAR(191),
    "vendor" TEXT,
    "street1" VARCHAR(191),
    "street2" VARCHAR(191),
    "city" VARCHAR(191),
    "state" VARCHAR(191),
    "zip" VARCHAR(191),
    "location_number" VARCHAR(191),
    "parking_loading" VARCHAR(191),
    "status" "addresses_status" NOT NULL DEFAULT 'inactive',
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "idx_16458_primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_request" (
    "id" BIGSERIAL NOT NULL,
    "guid" TEXT,
    "user_id" TEXT NOT NULL,
    "address_id" BIGINT NOT NULL,
    "brokerage" VARCHAR(191),
    "order_number" VARCHAR(191),
    "date" DATE,
    "pickup_time" TIME,
    "arrival_time" TIME,
    "complete_time" TIME,
    "headcount" VARCHAR(191),
    "need_host" "catering_requests_need_host" NOT NULL DEFAULT 'no',
    "hours_needed" VARCHAR(191),
    "number_of_host" VARCHAR(191),
    "client_attention" TEXT,
    "pickup_notes" TEXT,
    "special_notes" TEXT,
    "image" TEXT,
    "status" "catering_requests_status" DEFAULT 'active',
    "order_total" DECIMAL(10,2) DEFAULT 0.00,
    "tip" DECIMAL(10,2) DEFAULT 0.00,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "idx_16474_primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatch" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_type" "dispatches_user_type" NOT NULL DEFAULT 'vendor',
    "service_id" BIGINT NOT NULL,
    "service_type" "dispatches_service_type" NOT NULL DEFAULT 'catering',
    "driver_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "idx_16494_primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_job" (
    "id" BIGSERIAL NOT NULL,
    "connection" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "exception" TEXT NOT NULL,
    "failed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idx_16501_primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" BIGSERIAL NOT NULL,
    "migration" VARCHAR(191) NOT NULL,
    "batch" BIGINT NOT NULL,

    CONSTRAINT "idx_16509_primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "on_demand" (
    "id" BIGSERIAL NOT NULL,
    "guid" TEXT,
    "user_id" TEXT NOT NULL,
    "address_id" BIGINT NOT NULL,
    "order_number" VARCHAR(191),
    "date" DATE,
    "pickup_time" TIME,
    "arrival_time" TIME,
    "complete_time" TIME,
    "hours_needed" VARCHAR(191),
    "item_delivered" VARCHAR(191),
    "vehicle_type" "on_demand_vehicle_type" NOT NULL DEFAULT 'Car',
    "client_attention" TEXT,
    "pickup_notes" TEXT,
    "special_notes" TEXT,
    "image" TEXT,
    "status" "on_demand_status" DEFAULT 'active',
    "order_total" DECIMAL(10,2) DEFAULT 0.00,
    "tip" DECIMAL(10,2) DEFAULT 0.00,
    "length" VARCHAR(191),
    "width" VARCHAR(191),
    "height" VARCHAR(191),
    "weight" VARCHAR(191),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "idx_16514_primary" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_passwordResetToken_key" ON "user"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_request" ADD CONSTRAINT "catering_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_request" ADD CONSTRAINT "catering_request_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_demand" ADD CONSTRAINT "on_demand_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_demand" ADD CONSTRAINT "on_demand_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
