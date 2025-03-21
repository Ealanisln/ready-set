// src/components/Orders/OnDemandOrders.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
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
import { Package2, AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/types/order"; // Import the actual OrderStatus enum

// Updated interface to better match Prisma schema
interface Order {
  id: string | number | bigint;
  user_id: string;
  order_number: string;
  brokerage?: string | null;
  status: OrderStatus;
  date: string | Date | null;
  order_total?: string | number | null;
  client_attention?: string | null;
}

// Define filter type (lowercase for UI purposes)
type StatusFilterType = 'all' | 'active' | 'assigned' | 'cancelled' | 'completed';

const statusStyles = {
  active: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  assigned: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
};

const getStatusStyle = (status: string) => {
  // Convert status to lowercase for styling lookup
  const statusKey = status.toLowerCase();
  return statusStyles[statusKey as keyof typeof statusStyles] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <div className="h-10 bg-gray-100 rounded animate-pulse" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-50 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
    ))}
  </div>
);

const OnDemandOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `/api/orders/on-demand-orders?page=${page}&limit=${limit}${
          statusFilter !== "all" ? `&status=${statusFilter}` : ""
        }`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error("Failed to fetch on-demand orders");
        }
        
        const data = await response.json();
        const ordersData = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersData);
        
        const totalCount = Array.isArray(data) 
          ? data.length 
          : data.totalCount || ordersData.length;
        setTotalPages(Math.ceil(totalCount / limit));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilter = (status: StatusFilterType) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Safely format a date that might be null
  const formatDate = (dateValue: string | Date | null) => {
    if (!dateValue) return "N/A";
    
    return new Date(dateValue).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Safely format currency value
  const formatCurrency = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return "$0.00";
    
    const numericValue = typeof value === "string" 
      ? parseFloat(value) 
      : value;
      
    return `$${numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">On-Demand Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all on-demand delivery orders across the platform.
          </p>
        </div>
        <Link 
          href="/on-demand-request" 
          className="inline-flex items-center px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="all" 
            className="space-y-4"
            onValueChange={(value) => handleStatusFilter(value as StatusFilterType)}
          >
            <TabsList className="grid grid-cols-5 gap-4 bg-muted/50 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Orders
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900">
                Active
              </TabsTrigger>
              <TabsTrigger value="assigned" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                Assigned
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
                Cancelled
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="space-y-4">
              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : orders.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[200px]">Order Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Client Details</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id.toString()} className="hover:bg-muted/50">
                          <TableCell>
                            <Link
                              href={`/admin/on-demand-orders/${order.order_number}`}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {order.order_number}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusStyle(order.status.toString())}>
                              {order.status.toString()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(order.date)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{order.client_attention || "N/A"}</span>
                            {order.brokerage && (
                              <span className="text-sm text-muted-foreground block">
                                {order.brokerage}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(order.order_total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No orders found</h3>
                  <p className="text-muted-foreground">
                    No {statusFilter !== 'all' ? statusFilter : ''} orders are currently available.
                  </p>
                </div>
              )}

              {!isLoading && orders.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(page - 1)} 
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => handlePageChange(i + 1)}
                          isActive={page === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(page + 1)} 
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnDemandOrdersPage;