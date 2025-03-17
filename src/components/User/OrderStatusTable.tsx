
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
import { Loader2, Package } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  order_type: string;
  status: string;
  date: string;
  pickup_time?: string;
  arrival_time?: string;
  order_total: string | number;
  client_attention?: string;
  address?: {
    street1: string | null;
    city: string | null;
    state: string | null;
  };
  delivery_address?: {
    street1: string | null;
    city: string | null;
    state: string | null;
  };
}

interface OrderStatusTableProps {
  userType: "driver" | "vendor" | "client";
  apiEndpoint: string;
  title: string;
  description: string;
}

const OrderStatusTable: React.FC<OrderStatusTableProps> = ({
  userType,
  apiEndpoint,
  title,
  description,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const apiUrl = `${apiEndpoint}?page=${page}&limit=${limit}`;
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

    void fetchOrders();
  }, [apiEndpoint, page, limit]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const getOrderTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "catering":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "on_demand":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              No Orders Found
            </h3>
            <p className="max-w-md text-gray-500 dark:text-gray-400">
              There are no orders to display at the moment. Check back later or contact support if you think this is an error.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  {userType === "driver" && (
                    <>
                      <TableHead className="hidden lg:table-cell">Pickup</TableHead>
                      <TableHead className="hidden lg:table-cell">Delivery</TableHead>
                    </>
                  )}
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={`${order.id}-${order.order_number}-${index}`}>
                    <TableCell>
                      <Link
                        href={`/${userType}/orders/${order.order_number}`}
                        className="font-medium hover:underline"
                      >
                        {order.order_number}
                      </Link>
                      {order.client_attention && (
                        <div className="text-muted-foreground hidden text-sm md:inline">
                          {order.client_attention}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={getOrderTypeBadgeClass(order.order_type)}>
                        {order.order_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        className="text-xs"
                        variant={order.status.toLowerCase() === "active" ? "secondary" : "outline"}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    {userType === "driver" && (
                      <>
                        <TableCell className="hidden lg:table-cell">
                          {order.address ? `${order.address.street1}, ${order.address.city}, ${order.address.state}` : "N/A"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {order.delivery_address
                            ? `${order.delivery_address.street1}, ${order.delivery_address.city}, ${order.delivery_address.state}`
                            : "N/A"}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="text-right">
                      ${typeof order.order_total === "string"
                        ? parseFloat(order.order_total).toFixed(2)
                        : order.order_total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between">
              <Button onClick={handlePrevPage} disabled={page === 1}>
                Previous
              </Button>
              <Button onClick={handleNextPage} disabled={orders.length < limit}>
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusTable;