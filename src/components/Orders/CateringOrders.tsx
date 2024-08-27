"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  brokerage?: string;
  status: string;
  date: string;
  order_total: string | number;
  client_attention: string;
}

const CateringOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const apiUrl = `/api/orders/catering-orders?page=${page}&limit=${limit}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch catering orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, statusFilter]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const handleStatusFilter = (status: "all" | "active" | "completed") => {
    setStatusFilter(status);
    setPage(1);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Catering Orders</CardTitle>
          <CardDescription>Manage all catering orders across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(value) => handleStatusFilter(value as "all" | "active" | "completed")}>
            <div className="flex items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <OrdersTable orders={orders} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="active">
              <OrdersTable orders={orders.filter(order => order.status === "active")} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="completed">
              <OrdersTable orders={orders.filter(order => order.status === "completed")} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
          <div className="mt-4 flex justify-between">
            <Button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </Button>
            <Button onClick={handleNextPage}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading }) => {
  if (isLoading) {
    return <div>Loading catering orders...</div>;
  }

  return (
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
  );
};

export default CateringOrdersPage;