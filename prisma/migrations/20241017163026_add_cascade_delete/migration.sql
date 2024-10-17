-- DropForeignKey
ALTER TABLE "catering_request" DROP CONSTRAINT "catering_request_user_id_fkey";

-- DropForeignKey
ALTER TABLE "file_upload" DROP CONSTRAINT "file_upload_cateringRequestId_fkey";

-- DropForeignKey
ALTER TABLE "file_upload" DROP CONSTRAINT "file_upload_onDemandId_fkey";

-- DropForeignKey
ALTER TABLE "on_demand" DROP CONSTRAINT "on_demand_user_id_fkey";

-- DropForeignKey
ALTER TABLE "userAddress" DROP CONSTRAINT "userAddress_addressId_fkey";

-- DropForeignKey
ALTER TABLE "userAddress" DROP CONSTRAINT "userAddress_userId_fkey";

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catering_request" ADD CONSTRAINT "catering_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_demand" ADD CONSTRAINT "on_demand_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_cateringRequestId_fkey" FOREIGN KEY ("cateringRequestId") REFERENCES "catering_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_onDemandId_fkey" FOREIGN KEY ("onDemandId") REFERENCES "on_demand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
