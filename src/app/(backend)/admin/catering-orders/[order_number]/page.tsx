// src/app/(backend)/admin/catering-orders/[order_number]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ClipboardList } from "lucide-react";

const OrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get the order number from the URL using pathname
    if (pathname) {
      const pathSegments = pathname.split("/");
      const lastSegment = pathSegments[pathSegments.length - 1];
      setOrderNumber(lastSegment);
    }
  }, [pathname]);

  const handleDeleteSuccess = () => {
    router.push("/admin/catering-orders");
  };

  return (
    <div className="bg-slate-50 flex min-h-screen w-full flex-col">
      <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <Button
          onClick={() => router.push("/admin/catering-orders")}
          variant="ghost"
          size="icon"
          className="mr-2 h-9 w-9 text-slate-500 hover:text-amber-600"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to orders</span>
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/" className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/catering-orders" className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-1" />
                  Catering Orders
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-amber-600">
                Order {orderNumber}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex-1">
        <SingleOrder onDeleteSuccess={handleDeleteSuccess} showHeader={false} />
      </div>
    </div>
  );
};

export default OrderPage;
