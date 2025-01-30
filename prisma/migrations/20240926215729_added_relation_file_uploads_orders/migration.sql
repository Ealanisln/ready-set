-- AlterTable
ALTER TABLE "file_upload" ADD COLUMN     "cateringRequestId" BIGINT,
ADD COLUMN     "onDemandId" BIGINT;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES "catering_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_onDemandId_fkey" FOREIGN KEY ("onDemandId") REFERENCES "on_demand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
