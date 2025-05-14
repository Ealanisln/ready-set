// src/components/Orders/OnDemandOrders/OnDemandOrdersPage.tsx

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
  Clock // Added Clock icon for time
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

// --- Interface specific to On Demand Orders (ensure it matches API response) ---
interface OnDemandOrder {
  id: string; // API serializes BigInt to string
  order_number: string;
  status: string;
  date: string; // String format 'YYYY-MM-DD...'
  pickup_time: string; // String format 'HH:MM:SS...'
  order_total: string; // Prisma Decimal often serializes to string
  user: {
    name: string | null;
  };
}

// --- Status Configuration ---
type OrderStatus = 'all' | 'active' | 'assigned' | 'cancelled' | 'completed';

// Using a different structure for statusConfig to avoid potential JSX in object literal issues
const getStatusConfig = (status: string) => {
    const lowerStatus = status?.toLowerCase() || 'unknown';
    switch (lowerStatus) {
        case 'active':
            return { className: "bg-amber-100 text-amber-800 hover:bg-amber-200", icon: <AlertCircle className="h-3 w-3" /> };
        case 'assigned':
            return { className: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: <User className="h-3 w-3" /> };
        case 'cancelled':
            return { className: "bg-red-100 text-red-800 hover:bg-red-200", icon: <AlertCircle className="h-3 w-3" /> };
        case 'completed':
            return { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", icon: <ClipboardList className="h-3 w-3" /> };
        default:
            return { className: "bg-gray-100 text-gray-800 hover:bg-gray-200", icon: null };
    }
};


// --- Loading Skeleton ---
const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-10 w-[200px]" />
    </div>
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-slate-50 p-4">
        {/* Adjust grid-cols based on the actual number of columns (6 in this case) */}
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-8 w-full" />))}
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-t p-4">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, j) => (<Skeleton key={j} className="h-6 w-full" style={{ animationDelay: `${i * 100 + j * 50}ms` }} />))}
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-10 w-[300px]" />
    </div>
  </div>
);
// --- End of skeleton ---

const ITEMS_PER_PAGE = 10; // Define items per page, match backend if possible

const OnDemandOrdersPage: React.FC = () => {
  // --- State ---
  const [orders, setOrders] = useState<OnDemandOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // --- Updated useEffect for Data Fetching ---
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      // --- Construct API URL with query parameters ---
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sort: sortField,
        direction: sortDirection,
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const apiUrl = `/api/orders/on-demand-orders?${params.toString()}`;
      // console.log("Fetching:", apiUrl); // Optional: Log URL for debugging

      try {
        // --- Actual API Call ---
        const response = await fetch(apiUrl);

        if (!response.ok) {
          // Try to parse error message from API response body
          let errorData;
          try {
             errorData = await response.json();
          } catch (parseError) {
             // Ignore if response body is not JSON
          }
          const errorMessage = errorData?.message || `Failed to fetch orders (${response.status} ${response.statusText})`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // --- Validate API response structure ---
        if (!data || !Array.isArray(data.orders) || typeof data.totalPages !== 'number') {
           console.error("Invalid data structure received from API:", data);
           throw new Error('Invalid data structure received from API');
        }

        // --- Update State ---
        setOrders(data.orders);
        setTotalPages(data.totalPages);

      } catch (error) {
        console.error("API Fetch Error:", error); // Log the actual error
        setError(error instanceof Error ? error.message : "An unknown error occurred while fetching orders");
        setOrders([]); // Clear orders on error
        setTotalPages(1); // Reset pagination on error
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce fetch (300ms delay after user stops typing/changing filters)
    const debounceTimer = setTimeout(() => {
      fetchOrders();
    }, 300);

    // Cleanup function to clear the timer if dependencies change before timeout
    return () => clearTimeout(debounceTimer);

  // Dependencies that trigger a refetch
  }, [page, statusFilter, searchTerm, sortField, sortDirection]);

  // --- Handlers ---
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilter = (status: OrderStatus) => {
    setStatusFilter(status);
    setPage(1); // Reset page when filter changes
  };

  const handleSort = (field: string) => {
    const newDirection = (sortField === field && sortDirection === "asc") ? "desc" : "asc";
    if (sortField !== field) {
       setSortField(field);
       setSortDirection("asc"); // Default to asc when changing field
    } else {
       setSortDirection(newDirection); // Toggle direction if same field
    }
    setPage(1); // Reset page when sort changes
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ?
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50 rotate-180" /> :
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50" />;
  };

  // Helper to format time string (HH:MM:SS) into AM/PM
  const formatTime = (timeString: string | null | undefined): string => {
     if (!timeString) return '-';
     
     // Basic check for valid time format before splitting
     if (!/^\d{1,2}:\d{2}(:\d{2})?/.test(timeString)) return timeString;
     
     try {
       const timeParts = timeString.split(':');
       const hours = parseInt(timeParts[0] || '0', 10);
       const minutes = parseInt(timeParts[1] || '0', 10);
       
       if (isNaN(hours) || isNaN(minutes)) return timeString;
       
       const ampm = hours >= 12 ? 'PM' : 'AM';
       const displayHours = hours % 12 || 12; // Convert 0 to 12
       const displayMinutes = minutes < 10 ? `0${minutes}` : String(minutes);
       
       return `${displayHours}:${displayMinutes} ${ampm}`;
     } catch (error) {
       return timeString;
     }
  };
  // --- End of handlers/helpers ---

  // --- Return JSX ---
  return (
     <div className="p-6 space-y-6">

       {/* --- Page Title and New Order Button --- */}
       <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"> {/* Changed Gradient */}
             On Demand Orders
           </h1>
           <p className="text-slate-500 mt-1">
             Manage and track all immediate delivery orders.
           </p>
         </div>
         {/* --- Update Link to On Demand creation page --- */}
         <Link href="/on-demand-request"> {/* ADJUST LINK AS NEEDED */}
           <Button
             className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md transition-all hover:shadow-lg w-full lg:w-auto" /* Changed Gradient */
           >
             <PlusCircle className="mr-2 h-4 w-4" />
             New On Demand Order
           </Button>
         </Link>
       </div>

       {/* --- Card containing filters and table --- */}
       <Card className="shadow-sm rounded-xl border-slate-200 overflow-hidden">
         <CardContent className="p-0">

           {/* --- Filters Section --- */}
           <div className="border-b bg-slate-50 p-4">
             <div className="flex flex-col lg:flex-row gap-4 justify-between">
               <div className="flex gap-2 flex-1 flex-wrap">
                 {/* Search Input */}
                 <div className="relative flex-1 min-w-[200px]">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input
                     placeholder="Search order #, client..."
                     className="pl-9 h-10 w-full"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                 </div>
                 {/* Filter Dropdown (Keep or customize options) */}
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
                     {/* Add On Demand specific filters if needed */}
                   </DropdownMenuContent>
                 </DropdownMenu>
                 {/* Sort Select */}
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
                     {/* Add other sortable fields if desired, e.g., pickup_time */}
                     {/* <SelectItem value="pickup_time">Pickup Time</SelectItem> */}
                   </SelectContent>
                 </Select>
                 {/* Sort Direction Button */}
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
                       ? (status === 'all' ? 'bg-slate-700 text-white hover:bg-slate-800' : (getStatusConfig(status)?.className || '').replace('hover:bg-', 'bg-').replace('100', '200'))
                       : 'text-slate-600 hover:bg-slate-100'
                     } text-xs px-3 py-1 h-auto`}
                  >
                    {status.replace('_', ' ')}
                  </Button>
                ))}
             </div>
           </div>

           {/* --- Table Section --- */}
           <div className="mt-0">
             {isLoading ? (
                <LoadingSkeleton /> // Ensure Skeleton matches column count (6)
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
                     {/* --- Adjust Table Headers for On Demand --- */}
                     <TableRow className="hover:bg-transparent bg-slate-50">
                       <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort("order_number")}>
                         <div className="flex items-center">Order #{getSortIcon("order_number")}</div>
                       </TableHead>
                       <TableHead className="w-[120px]">Status</TableHead>
                       <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                         <div className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-slate-400" />Date{getSortIcon("date")}</div>
                       </TableHead>
                        <TableHead> {/* New column for Pickup Time */}
                          <div className="flex items-center"><Clock className="h-4 w-4 mr-1 text-slate-400" />Pickup Time</div>
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
                       {orders.map((order) => {
                         const statusInfo = getStatusConfig(order.status); // Get status config once
                         return (
                           <motion.tr
                             key={order.id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             transition={{ duration: 0.2 }}
                             className="group hover:bg-slate-50"
                           >
                             <TableCell>
                                {/* --- Update Link to On Demand detail page --- */}
                               <Link
                                 href={`/admin/on-demand-orders/${order.order_number}`} // ADJUST LINK
                                 className="font-medium text-slate-800 hover:text-blue-600 transition-colors group-hover:underline" // Changed hover color
                               >
                                 {order.order_number}
                               </Link>
                             </TableCell>
                             <TableCell>
                               <Badge className={`${statusInfo.className} flex items-center w-fit gap-1 px-2 py-0.5 font-semibold text-xs capitalize`}>
                                  {statusInfo.icon && React.cloneElement(statusInfo.icon, { className: "h-3 w-3" })} {/* Ensure icon size */}
                                  {order.status}
                               </Badge>
                             </TableCell>
                             <TableCell className="text-sm text-slate-600">
                               {/* Format Date - Assuming 'date' is like '2025-03-28...' */}
                               {new Date(order.date + 'T00:00:00Z').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                             </TableCell>
                             <TableCell className="text-sm text-slate-600">
                                {/* Format Pickup Time */}
                                {formatTime(order.pickup_time)}
                             </TableCell>
                             <TableCell className="font-medium text-slate-700">
                               {order.user?.name || <span className="text-slate-400 italic">N/A</span>} {/* Handle null name */}
                               </TableCell>
                             <TableCell className="text-right font-semibold text-slate-800">
                               {/* Format Currency */}
                               <span className="group-hover:text-blue-700 transition-colors"> {/* Changed hover color */}
                                 ${parseFloat(order.order_total || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                               </span>
                             </TableCell>
                           </motion.tr>
                         )
                       })}
                     </AnimatePresence>
                   </TableBody>
                 </Table>
               </div>
             ) : (
               // --- Empty State ---
               <div className="flex flex-col items-center justify-center py-16 text-center">
                 <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                   <ClipboardList className="h-8 w-8 text-slate-400" />
                 </div>
                 <h3 className="text-lg font-semibold text-slate-800">No On Demand Orders Found</h3>
                 <p className="text-slate-500 max-w-md mt-1">
                   No {statusFilter !== 'all' ? <span className="capitalize font-medium">{statusFilter}</span> : ''} orders match your current filters. Try adjusting your search or filters.
                 </p>
                  {/* --- Update Link to On Demand creation page --- */}
                 <Link href="/on-demand-request" className="mt-4"> {/* ADJUST LINK AS NEEDED */}
                   <Button variant="outline" className="mt-2">
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Create New On Demand Order
                   </Button>
                 </Link>
               </div>
             )}

             {/* --- Pagination Section (Keep as is, uses totalPages state from API) --- */}
             {!isLoading && totalPages > 1 && (
               <div className="p-4 border-t bg-slate-50">
                 <Pagination>
                   <PaginationContent>
                     <PaginationItem>
                       <PaginationPrevious
                         onClick={() => handlePageChange(page - 1)}
                         className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-slate-200"}
                         aria-disabled={page === 1}
                       />
                     </PaginationItem>
                     {/* Consider a more advanced pagination rendering logic for many pages */}
                     {[...Array(totalPages)].map((_, i) => (
                       <PaginationItem key={`page-${i + 1}`}>
                         <PaginationLink
                           onClick={() => handlePageChange(i + 1)}
                           isActive={page === i + 1}
                           // Use blue theme for active pagination
                           className={`cursor-pointer ${page === i + 1 ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 font-bold' : 'hover:bg-slate-200'}`}
                           aria-current={page === i + 1 ? 'page' : undefined}
                         >
                           {i + 1}
                         </PaginationLink>
                       </PaginationItem>
                     ))}
                     <PaginationItem>
                       <PaginationNext
                         onClick={() => handlePageChange(page + 1)}
                         className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-slate-200"}
                          aria-disabled={page === totalPages}
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

export default OnDemandOrdersPage;