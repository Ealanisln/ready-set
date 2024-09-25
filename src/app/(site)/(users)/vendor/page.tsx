import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import OrderStatusTable from "@/components/User/OrderStatusTable";

const DriverPage = () => {
  return (
    <>
      <Breadcrumb pageName="Driver Orders" />
      <section className="relative py-20 md:py-[120px]">
        <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
        <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
        <div className="container px-4">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <OrderStatusTable
                userType="driver"
                apiEndpoint="/api/driver-deliveries"
                title="Your Deliveries"
                description="View and manage your assigned deliveries across the platform."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DriverPage;