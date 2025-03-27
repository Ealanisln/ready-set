"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
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
import { 
  ClipboardList, 
  AlertCircle, 
  Search, 
  ChevronDown, 
  Calendar, 
  User, 
  DollarSign,
  PlusCircle,
  Filter
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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

const statusConfig = {
  active: {
    className: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    icon: <AlertCircle className="h-3 w-3 mr-1" />
  },
  assigned: {
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    icon: <User className="h-3 w-3 mr-1" />
  },
  cancelled: {
    className: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: <AlertCircle className="h-3 w-3 mr-1" />
  },
  completed: {
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    icon: <ClipboardList className="h-3 w-3 mr-1" />
  },
};

const getStatusConfig = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig] || {
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    icon: null
  };
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-10 w-[200px]" />
    </div>
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-slate-50 p-4">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-t p-4">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-6 w-full" style={{ animationDelay: `${i * 100 + j * 50}ms` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-10 w-[300px]" />
    </div>
  </div>
);

const CateringOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<CateringOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/orders/catering-orders?page=${page}&status=${statusFilter === 'all' ? '' : statusFilter}&search=${searchTerm}&sort=${sortField}&direction=${sortDirection}`
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

    const debounceTimer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, statusFilter, searchTerm, sortField, sortDirection]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilter = (status: OrderStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50 rotate-180" />;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Catering Orders
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track all catering orders across the platform
          </p>
        </div>
        <Link href="/catering-request">
          <Button 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition-all hover:shadow-lg w-full lg:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm rounded-xl border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b bg-slate-50 p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search order number, client..."
                    className="pl-9 h-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 h-10">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      Today's Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      This Week's Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      This Month's Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      High Value ({'>'}$1000)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Select
                  value={sortField}
                  onValueChange={(value) => {
                    setSortField(value);
                    setSortDirection("asc");
                  }}
                >
                  <SelectTrigger className="w-auto h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="order_total">Amount</SelectItem>
                    <SelectItem value="order_number">Order Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                variant={statusFilter === 'all' ? "default" : "outline"} 
                onClick={() => handleStatusFilter('all')}
                className={statusFilter === 'all' ? "bg-white text-slate-900 shadow-sm hover:bg-slate-50" : ""}
              >
                All Orders
              </Button>
              <Button 
                variant={statusFilter === 'active' ? "default" : "outline"} 
                onClick={() => handleStatusFilter('active')}
                className={statusFilter === 'active' ? "bg-amber-100 text-amber-900 hover:bg-amber-200 shadow-sm border-amber-200" : ""}
              >
                Active
              </Button>
              <Button 
                variant={statusFilter === 'assigned' ? "default" : "outline"} 
                onClick={() => handleStatusFilter('assigned')}
                className={statusFilter === 'assigned' ? "bg-blue-100 text-blue-900 hover:bg-blue-200 shadow-sm border-blue-200" : ""}
              >
                Assigned
              </Button>
              <Button 
                variant={statusFilter === 'cancelled' ? "default" : "outline"} 
                onClick={() => handleStatusFilter('cancelled')}
                className={statusFilter === 'cancelled' ? "bg-red-100 text-red-900 hover:bg-red-200 shadow-sm border-red-200" : ""}
              >
                Cancelled
              </Button>
              <Button 
                variant={statusFilter === 'completed' ? "default" : "outline"} 
                onClick={() => handleStatusFilter('completed')}
                className={statusFilter === 'completed' ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 shadow-sm border-emerald-200" : ""}
              >
                Completed
              </Button>
            </div>
          </div>

          <div className="mt-0">
            {isLoading ? (
              <div className="p-4">
                <LoadingSkeleton />
              </div>
            ) : error ? (
              <div className="p-4">
                <Alert variant="destructive" className="rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px] cursor-pointer" onClick={() => handleSort("order_number")}>
                        <div className="flex items-center">
                          <span>Order Number</span>
                          {getSortIcon("order_number")}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          <span>Event Date</span>
                          {getSortIcon("date")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-slate-400" />
                          <span>Client</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort("order_total")}>
                        <div className="flex items-center justify-end">
                          <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
                          <span>Total</span>
                          {getSortIcon("order_total")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group"
                        >
                          <TableCell>
                            <Link 
                              href={`/admin/catering-orders/${order.order_number}`} 
                              className="font-medium text-slate-800 hover:text-amber-600 transition-colors group-hover:underline"
                            >
                              {order.order_number}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusConfig(order.status).className} flex items-center w-fit gap-1 px-2.5 py-1 font-medium text-xs`}>
                              {getStatusConfig(order.status).icon}
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
                            <span className="group-hover:text-amber-600 transition-colors">
                              ${parseFloat(order.order_total).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No orders found</h3>
                <p className="text-slate-500 max-w-md mt-1">
                  No {statusFilter !== 'all' ? statusFilter : ''} orders are currently available.
                  {statusFilter === 'all' && ' Try creating a new order or adjusting your search filters.'}
                </p>
                <Link href="/catering-request" className="mt-4">
                  <Button variant="outline" className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Order
                  </Button>
                </Link>
              </div>
            )}

            {!isLoading && orders.length > 0 && (
              <div className="p-4 border-t">
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CateringOrdersPage;