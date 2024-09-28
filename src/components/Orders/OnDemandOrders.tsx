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
  order_number: string;
  status: 'active' | 'assigned' | 'cancelled' | 'completed';
  event_date: string;
  order_total: string | number;
  client_name: string;
}

const OrdersPage: React.FC = () => {
  const [orderType, setOrderType] = useState<'catering' | 'ondemand'>('catering');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'assigned' | 'cancelled' | 'completed'>('all');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/orders/${orderType}-orders?page=${page}&status=${statusFilter}`);
        if (!response.ok) throw new Error(`Failed to fetch ${orderType} orders`);
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalPages(Math.ceil(data.totalCount / 10));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [orderType, page, statusFilter]);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleStatusFilter = (status: 'all' | 'active' | 'assigned' | 'cancelled' | 'completed') => {
    setStatusFilter(status);
    setPage(1);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>On-demand Orders</CardTitle>
          <CardDescription>Manage all orders across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="catering" onValueChange={(value) => setOrderType(value as 'catering' | 'ondemand')}>
            <TabsContent value="catering">
              <OrdersTable
                orders={orders}
                isLoading={isLoading}
                statusFilter={statusFilter}
                handleStatusFilter={handleStatusFilter}
                orderType="catering"
              />
            </TabsContent>
            <TabsContent value="ondemand">
              <OrdersTable
                orders={orders}
                isLoading={isLoading}
                statusFilter={statusFilter}
                handleStatusFilter={handleStatusFilter}
                orderType="ondemand"
              />
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
  isLoading: boolean;
  statusFilter: 'all' | 'active' | 'assigned' | 'cancelled' | 'completed';
  handleStatusFilter: (status: 'all' | 'active' | 'assigned' | 'cancelled' | 'completed') => void;
  orderType: 'catering' | 'ondemand';
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, statusFilter, handleStatusFilter, orderType }) => {
  return (
    <>
      <Tabs defaultValue="all" onValueChange={(value) => handleStatusFilter(value as 'all' | 'active' | 'assigned' | 'cancelled' | 'completed')}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={statusFilter}>
          {isLoading ? (
            <div>Loading orders...</div>
          ) : orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/${orderType}-orders/${order.order_number}`} className="font-medium hover:underline">
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.status === "active" ? "secondary" : "outline"}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(order.event_date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.client_name}</TableCell>
                    <TableCell className="text-right">
                      ${typeof order.order_total === "string" ? parseFloat(order.order_total).toFixed(2) : order.order_total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div>No orders found.</div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default OrdersPage;