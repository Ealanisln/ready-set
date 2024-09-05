"use client";

import React from "react";
import { CateringOrdersTable } from "./CateringOrdersTable";
import useCateringOrders from "./useCateringOrders";
import { CateringOrdersHeader } from "./CateringOrdersHeader";
import { CateringOrdersPagination } from "./CateringOrdersPagination";
import { Card, CardContent } from "@/components/ui/card";

const CateringOrdersPage: React.FC = () => {
  const {
    orders,
    isLoading,
    error,
    page,
    statusFilter,
    handleNextPage,
    handlePrevPage,
    handleStatusFilter,
  } = useCateringOrders();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CateringOrdersHeader />
        <CardContent>
          <CateringOrdersTable
            orders={orders}
            isLoading={isLoading}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilter}
          />
          <CateringOrdersPagination
            page={page}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default CateringOrdersPage;
