-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT "dispatch_catering_request_fkey";

-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT "dispatch_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT "dispatch_on_demand_fkey";

-- DropForeignKey
ALTER TABLE "dispatch" DROP CONSTRAINT "dispatch_user_id_fkey";

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_catering_request_fkey" FOREIGN KEY ("service_id") REFERENCES "catering_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch" ADD CONSTRAINT "dispatch_on_demand_fkey" FOREIGN KEY ("service_id") REFERENCES "on_demand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
