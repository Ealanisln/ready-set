"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Loader2, Package, Clock, CheckCircle, XCircle, TrendingUp, CalendarDays, Truck, Wallet } from "lucide-react";
import Link from "next/link";

// Types based on schema
interface Order {
  id: string;
  orderNumber: string;
  orderType: "catering" | "on_demand";
  status: string;
  pickupDateTime: string;
  arrivalDateTime: string;
  orderTotal: number;
  clientAttention?: string;
  pickupAddress: {
    street1: string;
    city: string;
    state: string;
  };
  deliveryAddress: {
    street1: string;
    city: string;
    state: string;
  };
}

interface VendorMetrics {
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  orderGrowth: number;
}

const VendorPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<VendorMetrics>({
    activeOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    orderGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        // In a real app, these would be separate API calls
        const ordersResponse = await fetch("/api/vendor/orders");
        const metricsResponse = await fetch("/api/vendor/metrics");
        
        if (!ordersResponse.ok || !metricsResponse.ok) {
          throw new Error("Failed to fetch vendor data");
        }
        
        const ordersData = await ordersResponse.json();
        const metricsData = await metricsResponse.json();
        
        setOrders(ordersData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    // For development, simulate API response
    const simulateData = () => {
      // Sample orders
      const sampleOrders: Order[] = [
        {
          id: "1",
          orderNumber: "ORD-2023-001",
          orderType: "catering",
          status: "ACTIVE",
          pickupDateTime: new Date().toISOString(),
          arrivalDateTime: new Date(Date.now() + 3600000).toISOString(),
          orderTotal: 256.99,
          clientAttention: "Leave at reception desk",
          pickupAddress: {
            street1: "123 Vendor St",
            city: "San Francisco",
            state: "CA"
          },
          deliveryAddress: {
            street1: "456 Client Ave",
            city: "San Francisco",
            state: "CA"
          }
        },
        {
          id: "2",
          orderNumber: "ORD-2023-002",
          orderType: "on_demand",
          status: "PENDING",
          pickupDateTime: new Date(Date.now() + 86400000).toISOString(),
          arrivalDateTime: new Date(Date.now() + 90000000).toISOString(),
          orderTotal: 125.50,
          pickupAddress: {
            street1: "123 Vendor St",
            city: "San Francisco",
            state: "CA"
          },
          deliveryAddress: {
            street1: "789 Business Blvd",
            city: "Oakland",
            state: "CA"
          }
        },
        {
          id: "3",
          orderNumber: "ORD-2023-003",
          orderType: "catering",
          status: "COMPLETED",
          pickupDateTime: new Date(Date.now() - 86400000).toISOString(),
          arrivalDateTime: new Date(Date.now() - 82800000).toISOString(),
          orderTotal: 450.75,
          clientAttention: "Corporate event - ask for Jessica",
          pickupAddress: {
            street1: "123 Vendor St",
            city: "San Francisco",
            state: "CA"
          },
          deliveryAddress: {
            street1: "101 Tech Park",
            city: "San Jose",
            state: "CA"
          }
        }
      ];

      // Sample metrics
      const sampleMetrics: VendorMetrics = {
        activeOrders: 7,
        completedOrders: 42,
        cancelledOrders: 3,
        pendingOrders: 5,
        totalRevenue: 12495.75,
        orderGrowth: 23.5
      };

      setOrders(sampleOrders);
      setMetrics(sampleMetrics);
      setIsLoading(false);
    };

    // Use simulated data for development
    simulateData();
    
    // Uncomment for production
    // fetchVendorData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get badge style based on order status
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      "ACTIVE": { variant: "default", label: "Active" },
      "PENDING": { variant: "secondary", label: "Pending" },
      "COMPLETED": { variant: "outline", label: "Completed" },
      "ASSIGNED": { variant: "secondary", label: "Assigned" },
      "CANCELLED": { variant: "destructive", label: "Cancelled" }
    };

    const statusConfig = statusMap[status] || { variant: "outline", label: status };
    
    return (
      <Badge variant={statusConfig.variant}>
        {statusConfig.label}
      </Badge>
    );
  };

  // Get badge for order type
  const getOrderTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className={
        type === "catering" 
          ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
          : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      }>
        {type === "catering" ? "Catering" : "On Demand"}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>We encountered a problem loading your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Vendor Dashboard" />
      <section className="relative py-6 md:py-8">
        <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
        <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
        <div className="container px-4">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Metrics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Active Orders */}
                <Card className="overflow-hidden">
                  <div className="h-1 bg-blue-500"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <span className="text-xs flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" /> Active now
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mt-3">{metrics.activeOrders}</h3>
                    <p className="text-sm text-gray-500 mt-1">Active Orders</p>
                  </CardContent>
                </Card>

                {/* Completed Orders */}
                <Card className="overflow-hidden">
                  <div className="h-1 bg-green-500"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="bg-green-50 text-green-600 p-3 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="text-xs text-gray-500">Last 30 days</span>
                    </div>
                    <h3 className="text-3xl font-bold mt-3">{metrics.completedOrders}</h3>
                    <p className="text-sm text-gray-500 mt-1">Completed Orders</p>
                  </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card className="overflow-hidden">
                  <div className="h-1 bg-yellow-500"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="bg-yellow-50 text-yellow-600 p-3 rounded-full">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <span className="text-xs flex items-center gap-1 text-yellow-600">
                        Needs attention
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mt-3">{metrics.pendingOrders}</h3>
                    <p className="text-sm text-gray-500 mt-1">Pending Orders</p>
                  </CardContent>
                </Card>

                {/* Revenue */}
                <Card className="overflow-hidden">
                  <div className="h-1 bg-purple-500"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <span className="text-xs flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" /> {metrics.orderGrowth}% this month
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mt-3">{formatCurrency(metrics.totalRevenue)}</h3>
                    <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Manage your recent and upcoming orders across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Package className="mb-4 h-16 w-16 text-gray-400" />
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        No Orders Found
                      </h3>
                      <p className="max-w-md text-gray-500 dark:text-gray-400">
                        There are no orders to display at the moment. Check back later or create a new order.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/vendor/create-order">Create New Order</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order Number</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Pickup</TableHead>
                            <TableHead className="hidden md:table-cell">Delivery</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>
                                <Link
                                  href={`/vendor/orders/${order.orderNumber}`}
                                  className="font-medium hover:underline"
                                >
                                  {order.orderNumber}
                                </Link>
                                {order.clientAttention && (
                                  <div className="text-muted-foreground hidden text-sm md:inline">
                                    {order.clientAttention}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {getOrderTypeBadge(order.orderType)}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {getStatusBadge(order.status)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(order.pickupDateTime).toLocaleString(undefined, { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(order.arrivalDateTime).toLocaleString(undefined, { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(order.orderTotal)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-4 flex justify-between">
                        <Button variant="outline">Previous</Button>
                        <Button asChild>
                          <Link href="/vendor/orders">View All Orders</Link>
                        </Button>
                        <Button>Next</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Deliveries */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deliveries</CardTitle>
                  <CardDescription>
                    Track your scheduled deliveries for today and tomorrow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-md bg-blue-50 flex items-start">
                    <div className="p-2 bg-blue-100 rounded-full mr-4">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">Delivery Insights</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        You have {metrics.activeOrders + metrics.pendingOrders} upcoming deliveries in the next 48 hours. 
                        Make sure your items are prepared and ready for pickup.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default VendorPage;