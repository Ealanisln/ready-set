-- CreateEnum
CREATE TYPE "FormSubmissionType" AS ENUM ('food', 'flower', 'bakery', 'specialty');

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formType" "FormSubmissionType" NOT NULL,
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
