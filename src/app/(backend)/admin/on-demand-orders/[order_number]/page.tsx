"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SingleOrder from "@/components/Orders/SingleOrder";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";

const OrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Get the order number from the URL
    if (pathname) {
      const pathSegments = pathname.split("/");
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment) {
        setOrderNumber(lastSegment);
      }
    }
  }, [pathname]);

  const router = useRouter();

  const handleDeleteSuccess = () => {
    router.push("/admin/");
  };

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/on-demand-orders">On demand Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Order {orderNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <SingleOrder onDeleteSuccess={handleDeleteSuccess} />{" "}
      </div>
    </div>
  );
};

export default OrderPage;
