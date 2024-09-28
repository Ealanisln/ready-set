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

interface CateringOrder {
  id: string;
  order_number: string;
  status: string;
  date: string;
  order_total: string;
  user: {
    name: string;
  };
}

const CateringOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<CateringOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'assigned' | 'cancelled' | 'completed'>('all');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Fetching orders: page=${page}, status=${statusFilter}`);
        const response = await fetch(`/api/orders/catering-orders?page=${page}&status=${statusFilter === 'all' ? '' : statusFilter}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (!Array.isArray(data)) {
          console.error('Invalid data structure:', data);
          throw new Error('Invalid data structure received from API');
        }
        
        setOrders(data);
        // Since we don't have a totalCount, we'll set a fixed number of pages or use the length of the array
        setTotalPages(Math.ceil(data.length / 10));
        console.log(`Set ${data.length} orders, total pages: ${Math.ceil(data.length / 10)}`);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error instanceof Error ? error.message : "An error occurred while fetching orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, statusFilter]);

  useEffect(() => {
    console.log('Current state:', { orders, isLoading, error, page, statusFilter, totalPages });
  }, [orders, isLoading, error, page, statusFilter, totalPages]);

  const handlePageChange = (newPage: number) => {
    console.log(`Changing page to ${newPage}`);
    setPage(newPage);
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'assigned' | 'cancelled' | 'completed') => {
    console.log(`Changing status filter to ${status}`);
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Catering Orders</CardTitle>
          <CardDescription>Manage all catering orders across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
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
                <div>Loading catering orders...</div>
              ) : error ? (
                <div>Error: {error}</div>
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
                          <Link href={`/admin/catering-orders/${order.order_number}`} className="font-medium hover:underline">
                            {order.order_number}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === "active" ? "secondary" : "outline"}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>{order.user.name}</TableCell>
                        <TableCell className="text-right">
                          ${parseFloat(order.order_total).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div>No catering orders found. (Orders array length: {orders.length})</div>
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

export default CateringOrdersPage;