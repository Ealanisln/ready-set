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
import { ClipboardList, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

type OrderStatus = 'all' | 'active' | 'assigned' | 'cancelled' | 'completed';

const statusStyles = {
  active: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  assigned: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
};

const getStatusStyle = (status: string) => {
  return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <div className="h-10 bg-gray-100 rounded animate-pulse" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-50 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
    ))}
  </div>
);

const CateringOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<CateringOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/orders/catering-orders?page=${page}&status=${statusFilter === 'all' ? '' : statusFilter}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders (${response.status})`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data structure received from API');
        }
        
        setOrders(data);
        setTotalPages(Math.ceil(data.length / 10));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred while fetching orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilter = (status: OrderStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catering Orders</h1>
          <p className="text-muted-foreground">Manage and track all catering orders across the platform.</p>
        </div>
        <Link 
          href="/catering-request" 
          className="inline-flex items-center px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors"
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          New Order
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="all" 
            className="space-y-4"
            onValueChange={(value) => handleStatusFilter(value as OrderStatus)}
          >
            <TabsList className="grid grid-cols-5 gap-4 bg-muted/50 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">All Orders</TabsTrigger>
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
                        <TableHead>Event Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Link 
                              href={`/admin/catering-orders/${order.order_number}`} 
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {order.order_number}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusStyle(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="font-medium">{order.user.name}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${parseFloat(order.order_total).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
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

export default CateringOrdersPage;