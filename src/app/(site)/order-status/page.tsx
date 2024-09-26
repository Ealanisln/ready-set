import Breadcrumb from "@/components/Common/Breadcrumb";
import ClientOrders from "@/components/User/UserOrdersTable";
import React from "react";

const OrderStatusPage = () => {
  return (
    <main>
      <Breadcrumb pageName="Order Status Page" />
      <ClientOrders/>
    </main>
  );
};

export default OrderStatusPage;
