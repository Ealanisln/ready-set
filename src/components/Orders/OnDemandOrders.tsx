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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const OnDemandOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const apiUrl = `/api/orders/on-demand-orders?page=${page}&limit=${limit}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
      console.log("Fetching orders from:", apiUrl);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch on-demand orders");
        }
        const data = await response.json();
        console.log("Received data:", data);
        
        // Check if data is an array (direct orders) or an object with orders property
        const ordersData = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersData);
        
        // Calculate total pages based on the data
        const totalCount = Array.isArray(data) ? data.length : data.totalCount || ordersData.length;
        setTotalPages(Math.ceil(totalCount / limit));
        
        console.log("Updated state:", { orders: ordersData, totalPages: Math.ceil(totalCount / limit) });
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, statusFilter]);

  const handlePageChange = (newPage: number) => {
    console.log("Changing to page:", newPage);
    setPage(newPage);
  };

  const handleStatusFilter = (status: "all" | "active" | "completed") => {
    console.log("Changing status filter to:", status);
    setStatusFilter(status);
    setPage(1);
  };

  console.log("Current state:", { orders, isLoading, error, page, statusFilter, totalPages });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>On-Demand Orders</CardTitle>
          <CardDescription>Manage all on-demand orders across the platform.</CardDescription>
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
            <TabsContent value={statusFilter}>
              {isLoading ? (
                <div>Loading on-demand orders...</div>
              ) : orders.length > 0 ? (
                <OrdersTable 
                  orders={statusFilter === "all" 
                    ? orders 
                    : orders.filter(order => order.status === statusFilter)
                  } 
                />
              ) : (
                <div>No orders found.</div>
              )}
            </TabsContent>
          </Tabs>
          {!isLoading && orders.length > 0 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(page - 1)} 
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => handlePageChange(i + 1)}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(page + 1)} 
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
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
                href={`/admin/on-demand-orders/${order.order_number}`}
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

export default OnDemandOrdersPage;