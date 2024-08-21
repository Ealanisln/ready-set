"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DriverOrder from "@/components/Driver/DriverOrder";

const OrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Get the order number from the URL
    const pathSegments = window.location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    setOrderNumber(lastSegment);
  }, []);

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DriverOrder />
      </div>
    </div>
  );
};

export default OrderPage;
