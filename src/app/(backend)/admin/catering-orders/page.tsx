// src/app/(backend)/admin/catering-orders/page.tsx

import React from "react";
import { Metadata } from "next";
import CateringOrdersPage from "@/components/Orders/CateringOrders/CateringOrdersPage";
import { PageHeader } from "@/components/Dashboard/ui/PageHeader"; // Adjust import path if needed

export const metadata: Metadata = {
  title: "Catering Orders | Admin Dashboard",
  description: "Manage and track all catering orders across the platform",
};

const Orders = () => {
  return (
    // This outer div might not be strictly necessary if the layout handles background
    // Keeping it simple here.
    <div className="flex w-full flex-col"> 
      {/* Wrapper for header, giving it specific padding */}
      <div className="p-6 pb-0"> 
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/admin" },
            // { label: "Orders", href: "/admin/orders" }, // Removed intermediate step if not needed
            { label: "Catering Orders", href: "/admin/catering-orders", active: true },
          ]}
        />
      </div>
      {/* Render the main page content component */}
      <CateringOrdersPage /> 
    </div>
  );
};

export default Orders;