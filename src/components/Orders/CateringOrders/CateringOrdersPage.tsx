// src/components/Orders/CateringOrders/CateringOrdersPage.tsx

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

// --- Interface, Type, Configs, Skeleton ---
interface CateringOrder {
  id: string;
  order_number: string;
  status: string;
  date: string;
  order_total: string;
  user: {
    name: string;
    email: string;
  };
  address: {
    id: string;
    name?: string;
    street1: string;
    city: string;
    state: string;
  };
  delivery_address: {
    id: string;
    name?: string;
    street1: string;
    city: string;
    state: string;
  };
  order_type: string;
}

// Define interface for the API response structure
interface CateringOrdersApiResponse {
  orders: CateringOrder[];
  totalPages: number; // Assuming the API returns totalPages
}

type OrderStatus = 'all' | 'active' | 'assigned' | 'cancelled' | 'completed';

const statusConfig = {
  active: { className: "bg-amber-100 text-amber-800 hover:bg-amber-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  assigned: { className: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: <User className="h-3 w-3 mr-1" /> },
  cancelled: { className: "bg-red-100 text-red-800 hover:bg-red-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  completed: { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", icon: <ClipboardList className="h-3 w-3 mr-1" /> },
};

const getStatusConfig = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig] || { className: "bg-gray-100 text-gray-800 hover:bg-gray-200", icon: null };
};

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-10 w-[200px]" />
    </div>
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-slate-50 p-4">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-8 w-full" />))}
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-t p-4">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, j) => (<Skeleton key={j} className="h-6 w-full" style={{ animationDelay: `${i * 100 + j * 50}ms` }} />))}
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
  const [limit] = useState(10); // Default limit for pagination

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct the query parameters
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort: sortField,
          direction: sortDirection,
        });

        // Add status filter if not 'all'
        if (statusFilter !== 'all') {
          queryParams.append('status', statusFilter);
        }

        // Add search term if provided
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }

        // Make the API request
        const response = await fetch(`/api/orders/catering-orders?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders (${response.status})`);
        }
        
        const apiResponse = await response.json() as CateringOrdersApiResponse;
        
        // Validate the structure of the API response
        if (!apiResponse || typeof apiResponse !== 'object' || !Array.isArray(apiResponse.orders)) {
          console.error("Invalid data structure received:", apiResponse);
          throw new Error('Invalid data structure received from API');
        }

        const ordersData = apiResponse.orders || [];

        // Format and set orders
        const formattedOrders = ordersData.map((order: any) => ({
          ...order,
          // Ensure order_total is always a string
          order_total: typeof order.order_total === 'string' 
            ? order.order_total 
            : String(order.order_total || '0'),
          // Ensure user name is available
          user: {
            ...order.user,
            name: order.user?.name || 'Unknown Client'
          }
        }));

        setOrders(formattedOrders);
        
        // Set total pages from the API response
        setTotalPages(apiResponse.totalPages || 1);
        
        // Remove or comment out the logic relying on x-total-count header if totalPages is reliable
        // const count = parseInt(response.headers.get('x-total-count') || '0', 10);
        // setTotalPages(Math.ceil(count / limit) || 1);
        
        // // If we have items but no count header, assume there are more pages
        // if (formattedOrders.length === limit && !response.headers.has('x-total-count')) {
        //   setTotalPages(page + 1);
        // }

      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred while fetching orders");
        console.error("Error fetching catering orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, statusFilter, searchTerm, sortField, sortDirection, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
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
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50 rotate-180" /> :  
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50" />;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format currency for display
  const formatCurrency = (amount: string) => {
    if (!amount) return '$0.00';
    const value = parseFloat(amount);
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="p-6 space-y-6"> 
      
      {/* Page Title and New Order Button */}
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

      {/* Card containing filters and table */}
      <Card className="shadow-sm rounded-xl border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          
          {/* Filters Section */}
          <div className="border-b bg-slate-50 p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="flex gap-2 flex-1 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search order #, client..."
                    className="pl-9 h-10 w-full"
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
                    <DropdownMenuItem>Today's Orders</DropdownMenuItem>
                    <DropdownMenuItem>This Week's Orders</DropdownMenuItem>
                    <DropdownMenuItem>This Month's Orders</DropdownMenuItem>
                    <DropdownMenuItem>High Value ({'>'}$1000)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Select
                  value={sortField}
                  onValueChange={(value) => { handleSort(value); }}
                >
                  <SelectTrigger className="w-auto h-10 min-w-[120px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="order_total">Amount</SelectItem>
                    <SelectItem value="order_number">Order Number</SelectItem>
                    <SelectItem value="user.name">Client Name</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => handleSort(sortField)} className="h-10 px-2">
                  {sortDirection === 'asc' ? 
                    <ChevronDown className="h-4 w-4 opacity-70 rotate-180" /> : 
                    <ChevronDown className="h-4 w-4 opacity-70" /> 
                  }
                  <span className="sr-only">Toggle Sort Direction</span>
                </Button>
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(['all', 'active', 'assigned', 'cancelled', 'completed'] as OrderStatus[]).map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "secondary" : "outline"}
                  onClick={() => handleStatusFilter(status)}
                  className={`capitalize ${
                    statusFilter === status 
                    ? (status === 'all' ? 'bg-slate-700 text-white hover:bg-slate-800' : getStatusConfig(status)?.className.replace('hover:bg-', 'bg-').replace('100', '200'))
                    : 'text-slate-600 hover:bg-slate-100' 
                  } text-xs px-3 py-1 h-auto`}
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Table Section */}
          <div className="mt-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="p-6 text-center">
                <Alert variant="destructive" className="inline-flex flex-col items-center">
                  <AlertCircle className="h-5 w-5 mb-2" />
                  <AlertTitle>Error Fetching Orders</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-slate-50">
                      <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort("order_number")}>
                        <div className="flex items-center">Order #{getSortIcon("order_number")}</div>
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        <div className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-slate-400" />Event Date{getSortIcon("date")}</div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("user.name")}>
                        <div className="flex items-center"><User className="h-4 w-4 mr-1 text-slate-400" />Client{getSortIcon("user.name")}</div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort("order_total")}>
                        <div className="flex items-center justify-end"><DollarSign className="h-4 w-4 mr-1 text-slate-400" />Total{getSortIcon("order_total")}</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group hover:bg-slate-50"
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
                            <Badge className={`${getStatusConfig(order.status).className} flex items-center w-fit gap-1 px-2 py-0.5 font-semibold text-xs capitalize`}>
                              {getStatusConfig(order.status).icon}
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {formatDate(order.date)}
                          </TableCell>
                          <TableCell className="font-medium text-slate-700">{order.user.name}</TableCell>
                          <TableCell className="text-right font-semibold text-slate-800">
                            <span className="group-hover:text-amber-700 transition-colors">
                              {formatCurrency(order.order_total)}
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No orders found</h3>
                <p className="text-slate-500 max-w-md mt-1">
                  No {statusFilter !== 'all' ? <span className="capitalize font-medium">{statusFilter}</span> : ''} orders match your current filters.
                </p>
                <Link href="/catering-request" className="mt-4">
                  <Button variant="outline" className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Order
                  </Button>
                </Link>
              </div>
            )}

            {/* Pagination Section */}
            {!isLoading && totalPages > 1 && (
              <div className="p-4 border-t bg-slate-50">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(page - 1)} 
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-slate-200"}
                      />
                    </PaginationItem>
                    {/* Basic Pagination - Consider a more advanced version for many pages */}
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => handlePageChange(i + 1)}
                          isActive={page === i + 1}
                          className={`cursor-pointer ${page === i + 1 ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'hover:bg-slate-200'}`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(page + 1)} 
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-slate-200"}
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