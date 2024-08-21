-- CreateEnum
CREATE TYPE "driver_status" AS ENUM ('arrived_at_vendor', 'en_route_to_client', 'arrived_to_client');

-- AlterTable
ALTER TABLE "catering_request" ADD COLUMN     "driver_status" "driver_status";

-- AlterTable
ALTER TABLE "on_demand" ADD COLUMN     "driver_status" "driver_status";

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_catering_request_fkey" FOREIGN KEY ("service_id") REFERENCES "catering_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_on_demand_fkey" FOREIGN KEY ("service_id") REFERENCES "on_demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
