-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('VENDOR', 'CLIENT', 'DRIVER', 'ADMIN', 'HELPDESK', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'DELETED');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('ARRIVED_AT_VENDOR', 'EN_ROUTE_TO_CLIENT', 'ARRIVED_TO_CLIENT', 'ASSIGNED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CateringNeedHost" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "CateringStatus" AS ENUM ('ACTIVE', 'ASSIGNED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OnDemandStatus" AS ENUM ('ACTIVE', 'ASSIGNED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'VAN', 'TRUCK');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'INTERVIEWING');

-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('FOOD', 'FLOWER', 'BAKERY', 'SPECIALTY');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "guid" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "type" "UserType" NOT NULL DEFAULT 'VENDOR',
    "companyName" TEXT,
    "contactName" TEXT,
    "contactNumber" TEXT,
    "website" TEXT,
    "street1" TEXT,
    "street2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "locationNumber" TEXT,
    "parkingLoading" TEXT,
    "counties" JSONB,
    "timeNeeded" TEXT,
    "cateringBrokerage" TEXT,
    "frequency" TEXT,
    "provide" TEXT,
    "headCount" INTEGER,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "sideNotes" TEXT,
    "confirmationCode" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "isTemporaryPassword" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
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
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catering_requests" (
    "id" UUID NOT NULL,
    "guid" TEXT,
    "userId" UUID NOT NULL,
    "pickupAddressId" UUID NOT NULL,
    "deliveryAddressId" UUID NOT NULL,
    "brokerage" TEXT,
    "orderNumber" TEXT NOT NULL,
    "pickupDateTime" TIMESTAMPTZ(6),
    "arrivalDateTime" TIMESTAMPTZ(6),
    "completeDateTime" TIMESTAMPTZ(6),
    "headcount" INTEGER,
    "needHost" "CateringNeedHost" NOT NULL DEFAULT 'NO',
    "hoursNeeded" DOUBLE PRECISION,
    "numberOfHosts" INTEGER,
    "clientAttention" TEXT,
    "pickupNotes" TEXT,
    "specialNotes" TEXT,
    "image" TEXT,
    "status" "CateringStatus" NOT NULL DEFAULT 'ACTIVE',
    "orderTotal" DECIMAL(10,2) DEFAULT 0.00,
    "tip" DECIMAL(10,2) DEFAULT 0.00,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "driverStatus" "DriverStatus",
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "catering_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatches" (
    "id" UUID NOT NULL,
    "cateringRequestId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" UUID,
    "onDemandId" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "userId" UUID,

    CONSTRAINT "dispatches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploads" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cateringRequestId" UUID,
    "onDemandId" UUID,
    "jobApplicationId" UUID,
    "category" TEXT,
    "isTemporary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "on_demand_requests" (
    "id" UUID NOT NULL,
    "guid" TEXT,
    "userId" UUID NOT NULL,
    "pickupAddressId" UUID NOT NULL,
    "deliveryAddressId" UUID NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "pickupDateTime" TIMESTAMPTZ(6) NOT NULL,
    "arrivalDateTime" TIMESTAMPTZ(6) NOT NULL,
    "completeDateTime" TIMESTAMPTZ(6),
    "hoursNeeded" DOUBLE PRECISION,
    "itemDelivered" TEXT,
    "vehicleType" "VehicleType" NOT NULL DEFAULT 'CAR',
    "clientAttention" TEXT NOT NULL,
    "pickupNotes" TEXT,
    "specialNotes" TEXT,
    "image" TEXT,
    "status" "OnDemandStatus" NOT NULL DEFAULT 'ACTIVE',
    "orderTotal" DECIMAL(10,2) DEFAULT 0.00,
    "tip" DECIMAL(10,2) DEFAULT 0.00,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "driverStatus" "DriverStatus",
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "on_demand_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "addressId" UUID NOT NULL,
    "alias" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formType" "FormType" NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "counties" JSONB NOT NULL,
    "frequency" TEXT NOT NULL,
    "pickupAddress" JSONB NOT NULL,
    "additionalComments" TEXT NOT NULL,
    "specifications" TEXT NOT NULL,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_captures" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "newsletterConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_captures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL,
    "profileId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "position" TEXT NOT NULL,
    "addressStreet" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressState" TEXT NOT NULL,
    "addressZip" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "workExperience" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "coverLetter" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "driversLicenseUrl" TEXT,
    "insuranceUrl" TEXT,
    "vehicleRegUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_email_idx" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_type_idx" ON "profiles"("type");

-- CreateIndex
CREATE INDEX "profiles_status_idx" ON "profiles"("status");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "addresses_createdBy_idx" ON "addresses"("createdBy");

-- CreateIndex
CREATE INDEX "addresses_city_state_idx" ON "addresses"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "catering_requests_orderNumber_key" ON "catering_requests"("orderNumber");

-- CreateIndex
CREATE INDEX "catering_requests_userId_idx" ON "catering_requests"("userId");

-- CreateIndex
CREATE INDEX "catering_requests_status_idx" ON "catering_requests"("status");

-- CreateIndex
CREATE INDEX "catering_requests_pickupDateTime_idx" ON "catering_requests"("pickupDateTime");

-- CreateIndex
CREATE INDEX "catering_requests_userId_status_idx" ON "catering_requests"("userId", "status");

-- CreateIndex
CREATE INDEX "catering_requests_deliveryAddressId_pickupDateTime_idx" ON "catering_requests"("deliveryAddressId", "pickupDateTime");

-- CreateIndex
CREATE INDEX "dispatches_driverId_idx" ON "dispatches"("driverId");

-- CreateIndex
CREATE INDEX "dispatches_cateringRequestId_idx" ON "dispatches"("cateringRequestId");

-- CreateIndex
CREATE INDEX "dispatches_onDemandId_idx" ON "dispatches"("onDemandId");

-- CreateIndex
CREATE INDEX "file_uploads_userId_idx" ON "file_uploads"("userId");

-- CreateIndex
CREATE INDEX "file_uploads_cateringRequestId_idx" ON "file_uploads"("cateringRequestId");

-- CreateIndex
CREATE INDEX "file_uploads_onDemandId_idx" ON "file_uploads"("onDemandId");

-- CreateIndex
CREATE INDEX "file_uploads_jobApplicationId_idx" ON "file_uploads"("jobApplicationId");

-- CreateIndex
CREATE INDEX "file_uploads_fileType_idx" ON "file_uploads"("fileType");

-- CreateIndex
CREATE UNIQUE INDEX "on_demand_requests_orderNumber_key" ON "on_demand_requests"("orderNumber");

-- CreateIndex
CREATE INDEX "on_demand_requests_userId_idx" ON "on_demand_requests"("userId");

-- CreateIndex
CREATE INDEX "on_demand_requests_status_idx" ON "on_demand_requests"("status");

-- CreateIndex
CREATE INDEX "on_demand_requests_pickupDateTime_idx" ON "on_demand_requests"("pickupDateTime");

-- CreateIndex
CREATE INDEX "on_demand_requests_vehicleType_idx" ON "on_demand_requests"("vehicleType");

-- CreateIndex
CREATE INDEX "on_demand_requests_userId_status_idx" ON "on_demand_requests"("userId", "status");

-- CreateIndex
CREATE INDEX "user_addresses_userId_idx" ON "user_addresses"("userId");

-- CreateIndex
CREATE INDEX "user_addresses_addressId_idx" ON "user_addresses"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "user_addresses_userId_addressId_key" ON "user_addresses"("userId", "addressId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "verification_tokens_token_idx" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "form_submissions_formType_idx" ON "form_submissions"("formType");

-- CreateIndex
CREATE INDEX "form_submissions_email_idx" ON "form_submissions"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lead_captures_email_key" ON "lead_captures"("email");

-- CreateIndex
CREATE INDEX "lead_captures_email_idx" ON "lead_captures"("email");

-- CreateIndex
CREATE INDEX "lead_captures_industry_idx" ON "lead_captures"("industry");

-- CreateIndex
CREATE INDEX "job_applications_email_idx" ON "job_applications"("email");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "job_applications_position_idx" ON "job_applications"("position");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_requests" ADD CONSTRAINT "catering_requests_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_requests" ADD CONSTRAINT "catering_requests_pickupAddressId_fkey" FOREIGN KEY ("pickupAddressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_requests" ADD CONSTRAINT "catering_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES "catering_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_onDemandId_fkey" FOREIGN KEY ("onDemandId") REFERENCES "on_demand_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES "catering_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_onDemandId_fkey" FOREIGN KEY ("onDemandId") REFERENCES "on_demand_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_demand_requests" ADD CONSTRAINT "on_demand_requests_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_demand_requests" ADD CONSTRAINT "on_demand_requests_pickupAddressId_fkey" FOREIGN KEY ("pickupAddressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_demand_requests" ADD CONSTRAINT "on_demand_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
