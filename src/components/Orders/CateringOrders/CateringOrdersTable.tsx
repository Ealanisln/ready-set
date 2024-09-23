import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Order, StatusFilter } from "./types";

interface CateringOrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
}

export const CateringOrdersTable: React.FC<CateringOrdersTableProps> = ({
  orders,
  isLoading,
  statusFilter,
  onStatusFilterChange,
}) => {
  console.log("CateringOrdersTable rendered with:", { orders, isLoading, statusFilter });

  if (isLoading) {
    return <div>Loading catering orders...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <Tabs value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}>
      <TabsContent value={statusFilter}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    href={`/admin/catering-orders/${order.order_number}`}
                    className="font-medium hover:underline"
                  >
                    {order.order_number}
                  </Link>
                  <br />
                  <div className="text-muted-foreground hidden text-sm md:inline">
                    {order.client_attention}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    className="text-xs"
                    variant={order.status === "active" ? "secondary" : "outline"}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(order.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  $
                  {typeof order.order_total === "string"
                    ? parseFloat(order.order_total).toFixed(2)
                    : order.order_total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};