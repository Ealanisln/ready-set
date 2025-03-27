// src/app/(backend)/admin/catering-orders/page.tsx

import React from "react";
import { Metadata } from "next";
import CateringOrdersPage from "@/components/Orders/CateringOrders/CateringOrdersPage";
import { PageHeader } from "@/components/Dashboard/ui/PageHeader";

export const metadata: Metadata = {
  title: "Catering Orders | Admin Dashboard",
  description: "Manage and track all catering orders across the platform",
};

const Orders = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="Catering Orders"
          description="Manage and track all catering orders across the platform"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Orders", href: "/admin/orders" },
            { label: "Catering", href: "/admin/catering-orders", active: true },
          ]}
        />
        <CateringOrdersPage />
      </div>
    </div>
  );
};

export default Orders;