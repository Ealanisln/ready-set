"use client";

import { useEffect, useState } from "react";
import DriverOrder from "@/components/Driver/DriverOrder";
import { BreadcrumbNavigation } from "@/components/Dashboard";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { usePathname } from "next/navigation";

const OrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Get the order number from the URL
    if (pathname) {
      const pathSegments = pathname.split("/");
      const lastSegment = pathSegments[pathSegments.length - 1];
      setOrderNumber(lastSegment);
    }
  }, [pathname]);

  return (
    <div className="relative z-10 overflow-hidden pb-[60px] pt-[120px] dark:bg-dark md:pt-[130px] lg:pt-[160px]">
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3"></div>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4">
            <DriverOrder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
