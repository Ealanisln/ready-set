"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, File } from "lucide-react";
import { Badge } from "../ui/badge";

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  brokerage?: string;
  status: string;
  date: string;
  order_total: string | number;
  client_attention: string;
  order_type: "catering" | "on_demand";
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [typeFilter, setTypeFilter] = useState<"all" | "catering" | "on_demand">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const apiUrl = `/api/orders?page=${page}&limit=${limit}${typeFilter !== "all" ? `&type=${typeFilter}` : ""}`;
      console.log("Fetching orders with URL:", apiUrl);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, typeFilter]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const handleTypeFilter = (type: "all" | "catering" | "on_demand") => {
    console.log("Changing filter to:", type);
    setTypeFilter(type);
    setPage(1);
  };

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
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>All Orders</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                View and manage all catering and on-demand orders across the platform.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem 
                    checked={typeFilter === "all"}
                    onSelect={() => handleTypeFilter("all")}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={typeFilter === "catering"}
                    onSelect={() => handleTypeFilter("catering")}
                  >
                    Catering
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={typeFilter === "on_demand"}
                    onSelect={() => handleTypeFilter("on_demand")}
                  >
                    On Demand
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  {typeFilter === "all" 
                    ? "All orders from the database." 
                    : `Filtered ${typeFilter} orders from the database.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Loading orders...</div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead className="hidden sm:table-cell">Type</TableHead>
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
                                href={`/admin/orders/${order.order_number}`}
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
                              <Badge className={`${getOrderTypeBadgeClass(order.order_type)}`}>
                                {order.order_type}
                              </Badge>
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
                    <div className="mt-4 flex justify-between">
                      <Button onClick={handlePrevPage} disabled={page === 1}>
                        Previous
                      </Button>
                      <Button onClick={handleNextPage}>Next</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Orders;