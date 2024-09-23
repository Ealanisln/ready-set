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

interface Delivery {
  id: string;
  order_number: string;
  delivery_type: "catering" | "on_demand";
  status: string;
  date: string;
  pickup_time: string;
  arrival_time: string;
  order_total: string | number;
  client_attention: string;
  address: {
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

const DriverDeliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setIsLoading(true);
      const apiUrl = `/api/driver-deliveries?page=${page}&limit=${limit}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch deliveries");
        }
        const data: Delivery[] = await response.json();
        setDeliveries(data);
        console.log(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, [page, limit]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const getDeliveryTypeBadgeClass = (type: "catering" | "on_demand") => {
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
    <section id="contact" className="relative py-20 md:py-[120px]">
      <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
      <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
      <div className="container px-4">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 ">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Deliveries</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  View and manage your assigned deliveries across the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
                  </div>
                ) : deliveries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Truck className="mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      No Deliveries Assigned Yet
                    </h3>
                    <p className="max-w-md text-gray-500 dark:text-gray-400">
                      You don&apos;t have any deliveries assigned at the moment.
                      Check back soon or contact dispatch if you&apos;re expecting
                      an assignment.
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
                        {deliveries.map((delivery, index) => (
                          <TableRow key={`${delivery.id}-${delivery.order_number}-${index}`}>
                            <TableCell>
                              <Link
                                href={`/driver/deliveries/${delivery.order_number}`}
                                className="font-medium hover:underline"
                              >
                                {delivery.order_number}
                              </Link>
                              <br />
                              <div className="text-muted-foreground hidden text-sm md:inline">
                                {delivery.client_attention}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                className={`${getDeliveryTypeBadgeClass(delivery.delivery_type)}`}
                              >
                                {delivery.delivery_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                className="text-xs"
                                variant={
                                  delivery.status === "active"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {delivery.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(delivery.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {delivery.address.street1}, {delivery.address.city},{" "}
                              {delivery.address.state}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {delivery.delivery_address
                                ? `${delivery.delivery_address.street1}, ${delivery.delivery_address.city}, ${delivery.delivery_address.state}`
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              $
                              {typeof delivery.order_total === "string"
                                ? parseFloat(delivery.order_total).toFixed(2)
                                : delivery.order_total.toFixed(2)}
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
                        disabled={deliveries.length < limit}
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

export default DriverDeliveries;