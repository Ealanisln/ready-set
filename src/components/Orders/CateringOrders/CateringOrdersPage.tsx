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
  Filter,
  ArrowUpDown
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
import { Order, StatusFilter, UserRole } from "./types";
import { CateringOrdersTable } from "./CateringOrdersTable";
import { createClient } from "@/utils/supabase/client";

// --- Interface, Type, Configs, Skeleton ---
enum CateringNeedHost {
  YES = 'YES',
  NO = 'NO',
  MAYBE = 'MAYBE'
}

enum DriverStatus {
  ARRIVED_AT_VENDOR = 'ARRIVED_AT_VENDOR',
  EN_ROUTE_TO_CLIENT = 'EN_ROUTE_TO_CLIENT',
  ARRIVED_TO_CLIENT = 'ARRIVED_TO_CLIENT',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED'
}

interface CateringOrder {
  id: string;
  userId: string;
  orderNumber: string;
  brokerage?: string | null;
  status: OrderStatus;
  pickupDateTime?: Date | string | null;
  arrivalDateTime?: Date | string | null;
  completeDateTime?: Date | string | null;
  headcount?: number | null;
  needHost: CateringNeedHost;
  hoursNeeded?: number | null;
  numberOfHosts?: number | null;
  clientAttention?: string | null;
  pickupNotes?: string | null;
  specialNotes?: string | null;
  image?: string | null;
  orderTotal?: number | null;
  tip?: number | null;
  driverStatus?: DriverStatus | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;
  user: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string | null;
  };
  pickupAddress: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
    county?: string | null;
  };
  deliveryAddress: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
    county?: string | null;
  };
  dispatches?: Array<{
    id: string;
    driver: {
      id: string;
      name: string;
      email: string;
      contactNumber?: string | null;
    };
  }>;
  order_type: 'catering';
}

// Define interface for the API response structure
interface CateringOrdersApiResponse {
  orders: CateringOrder[];
  totalPages: number;
}

type OrderStatus = 'ACTIVE' | 'ASSIGNED' | 'CANCELLED' | 'COMPLETED';

const statusConfig = {
  ACTIVE: { className: "bg-amber-100 text-amber-800 hover:bg-amber-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  ASSIGNED: { className: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: <User className="h-3 w-3 mr-1" /> },
  CANCELLED: { className: "bg-red-100 text-red-800 hover:bg-red-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  COMPLETED: { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", icon: <ClipboardList className="h-3 w-3 mr-1" /> },
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
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('ACTIVE');
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [limit] = useState(10); // Default limit for pagination
  const [userRoles, setUserRoles] = useState<UserRole>({
    isAdmin: false,
    isSuperAdmin: false,
    helpdesk: false
  });

  // Add status tabs
  const statusTabs = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

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
          status: statusFilter,
        });

        // Add search term if present
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }

        // Get current user for auth token
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        // Make API call with authentication
        const response = await fetch(`/api/orders/catering-orders?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
            // Use session access_token instead of user.id
            'Authorization': session ? `Bearer ${session.access_token}` : '',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data: CateringOrdersApiResponse = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching orders');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, statusFilter, searchTerm, sortField, sortDirection, limit]);

  // New useEffect to fetch user roles
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("No authenticated user found");
          return;
        }
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRoles({
            isAdmin: profile.type.toLowerCase() === 'admin',
            isSuperAdmin: profile.type.toLowerCase() === 'super_admin',
            helpdesk: profile.type.toLowerCase() === 'helpdesk'
          });
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };

    fetchUserRoles();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update status filter handler
  const handleStatusFilter = (status: OrderStatus) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when changing filters
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
  const formatDate = (dateInput: string | Date | null): string => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateInput: string | Date | null): string => {
    if (!dateInput) return 'N/A';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number | undefined | null): string => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Add refresh handler for when an order is deleted
  const handleOrderDeleted = () => {
    // Refetch orders
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
          status: statusFilter,
        });

        // Add search term if present
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }

        // Get current user for auth token
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        // Make API call with authentication
        const response = await fetch(`/api/orders/catering-orders?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session ? `Bearer ${session.access_token}` : '',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data: CateringOrdersApiResponse = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching orders');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  };

  // Add a function to map CateringOrder to Order
  const mapToOrderType = (orders: CateringOrder[]): Order[] => {
    return orders.map(order => ({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status.toLowerCase(),
      date: order.pickupDateTime || order.createdAt,
      order_total: order.orderTotal || 0,
      client_attention: order.clientAttention || undefined,
      user: order.user ? {
        id: order.user.id,
        name: order.user.name || 'N/A',
        email: order.user.email,
        contactNumber: order.user.contactNumber
      } : undefined,
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress
    }));
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
        <Link href="/admin/catering-orders/new" passHref>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition-all hover:shadow-lg w-full lg:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex space-x-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusFilter(tab.value as OrderStatus)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${statusFilter === tab.value 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card containing filters and the CateringOrdersTable */}
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
          </div>

          {/* CateringOrdersTable Component */}
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
              <CateringOrdersTable 
                orders={mapToOrderType(orders)}
                isLoading={isLoading}
                statusFilter={statusFilter.toLowerCase() as StatusFilter}
                onStatusFilterChange={(status) => handleStatusFilter(status.toUpperCase() as OrderStatus)}
                userRoles={userRoles}
                onOrderDeleted={handleOrderDeleted}
              />
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No orders found</h3>
                <p className="text-slate-500 max-w-md mt-1">
                  No {statusFilter !== 'ACTIVE' ? <span className="capitalize font-medium">{statusFilter}</span> : ''} orders match your current filters.
                </p>
                <Link href="/admin/catering-orders/new" className="mt-4">
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