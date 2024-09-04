// components/Orders/CateringOrders/CateringOrdersHeader.tsx
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CateringOrdersHeader: React.FC = () => (
  <CardHeader>
    <CardTitle>Catering Orders</CardTitle>
    <CardDescription>Manage all catering orders across the platform.</CardDescription>
  </CardHeader>
);
