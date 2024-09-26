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
import { Loader2, Truck } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  order_type: "catering" | "on_demand";
  status: string;
  date: string;
  pickup_time: string;
  arrival_time: string;
  order_total: string;
  client_attention: string;
  address: {
    street1: string | null;
    city: string | null;
    state: string | null;
  };
  delivery_address: {
    street1: string | null;
    city: string | null;
    state: string | null;
  } | null;
}

const ClientOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const apiUrl = `/api/user-orders?page=${page}&limit=${limit}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
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
  }, [page, limit]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const getOrderTypeBadgeClass = (type: "catering" | "on_demand") => {
    switch (type) {
      case "catering":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "on_demand":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "";
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section id="orders" className="relative py-20 md:py-[120px]">
      <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
      <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
      <div className="container px-4">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 ">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Orders</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  View and manage your orders. 
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Truck className="mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      No orders found
                    </h3>
                    <p className="max-w-md text-gray-500 dark:text-gray-400">
                      You don&apos;t have any orders at the moment.
                      Check back soon or contact us if you need support. 
                    </p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Type
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Pickup
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Delivery
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, index) => (
                          <TableRow key={`${order.id}-${order.order_number}-${index}`}>
                            <TableCell>
                              <Link
                                href={`/order-status/${order.order_number}`}
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
                                className={`${getOrderTypeBadgeClass(order.order_type)}`}
                              >
                                {order.order_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                className="text-xs"
                                variant={
                                  order.status === "active"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(order.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {order.address.street1}, {order.address.city},{" "}
                              {order.address.state}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {order.delivery_address
                                ? `${order.delivery_address.street1}, ${order.delivery_address.city}, ${order.delivery_address.state}`
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              ${parseFloat(order.order_total).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-between">
                      <Button onClick={handlePrevPage} disabled={page === 1}>
                        Previous
                      </Button>
                      <Button
                        onClick={handleNextPage}
                        disabled={orders.length < limit}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientOrders;