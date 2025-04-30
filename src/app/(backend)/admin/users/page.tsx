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
  Users2,
  AlertCircle,
  Search,
  ChevronDown,
  Calendar,
  User,
  PlusCircle,
  Filter,
  Mail,
  Phone
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// --- Types ---
type UserType = 'vendor' | 'client' | 'driver' | 'admin' | 'helpdesk' | 'super_admin';
type UserStatus = 'active' | 'pending' | 'deleted';

interface User {
  id: string;
  name?: string | null;
  email: string | null;
  type: UserType;
  contact_name?: string | null;
  contact_number?: string | null;
  status: UserStatus;
  createdAt: string; 
}

// --- Status and Type Configuration ---
const userTypeConfig: Record<UserType, { className: string, icon: React.ReactNode }> = {
  'vendor': { className: "bg-purple-100 text-purple-800 hover:bg-purple-200", icon: <User className="h-3 w-3" /> },
  'client': { className: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: <User className="h-3 w-3" /> },
  'driver': { className: "bg-green-100 text-green-800 hover:bg-green-200", icon: <User className="h-3 w-3" /> },
  'admin': { className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", icon: <User className="h-3 w-3" /> },
  'helpdesk': { className: "bg-orange-100 text-orange-800 hover:bg-orange-200", icon: <User className="h-3 w-3" /> },
  'super_admin': { className: "bg-red-100 text-red-800 hover:bg-red-200", icon: <User className="h-3 w-3" /> },
};

const statusConfig: Record<UserStatus, { className: string, icon: React.ReactNode }> = {
  'active': { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", icon: <AlertCircle className="h-3 w-3" /> },
  'pending': { className: "bg-amber-100 text-amber-800 hover:bg-amber-200", icon: <AlertCircle className="h-3 w-3" /> },
  'deleted': { className: "bg-red-100 text-red-800 hover:bg-red-200", icon: <AlertCircle className="h-3 w-3" /> },
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

const ITEMS_PER_PAGE = 10;

const UsersPage: React.FC = () => {
  // --- State ---
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  // --- Data Fetching ---
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const fetchUsers = async () => {
      if (!isMounted) return;
      // Set loading state at the beginning of the fetch attempt
      setIsLoading(true); 
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      params.append("sort", sortField);
      params.append("direction", sortDirection);

      const apiUrl = `/api/users?${params.toString()}`;

      try {
        // Attempt to get the session. Proceed even if it fails initially, 
        // relying on cookie-based auth in the API route.
        const { error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.warn("Error fetching session:", sessionError.message);
        }
        
        const response = await fetch(apiUrl, {
          credentials: 'include' 
        });

        if (!response.ok) {
          let errorData;
          try {
             errorData = await response.json();
          } catch (parseError) {
             // Ignore if response body is not JSON
          }
          const errorMessage = errorData?.error || `API Error: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.users) || typeof data.totalPages !== 'number') {
           console.error("Invalid data structure received from API:", data);
           throw new Error('Invalid data structure received from API');
        }
        
        if (isMounted) {
          setUsers(data.users);
          setTotalPages(data.totalPages);
        }

      } catch (error) {
        console.error("API Fetch Error:", error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : "An unknown error occurred while fetching users");
          setUsers([]); // Clear users on error
          setTotalPages(1); // Reset pagination on error
        }
      } finally {
        // Ensure loading is set to false only after everything, even errors
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // --- Effect Logic ---
    // Clear any existing timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set a new timer to fetch users after a delay
    debounceTimer = setTimeout(() => {
        fetchUsers();
    }, 300); // Debounce all fetches triggered by dependency changes

    // Cleanup function
    return () => {
      isMounted = false; // Set flag when component unmounts
      if (debounceTimer) clearTimeout(debounceTimer); // Clear timer on unmount or re-run
    };

  // Fetch when page, filters, search, or sort changes.
  }, [page, statusFilter, typeFilter, searchTerm, sortField, sortDirection, supabase]); 


  // --- Handlers ---
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilter = (status: UserStatus | 'all') => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleTypeFilter = (type: UserType | 'all') => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleSort = (field: string) => {
    const newDirection = (sortField === field && sortDirection === "asc") ? "desc" : "asc";
    if (sortField !== field) {
       setSortField(field);
       setSortDirection("asc");
    } else {
       setSortDirection(newDirection);
    }
    setPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ?
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50 rotate-180" /> :
      <ChevronDown className="h-4 w-4 inline ml-1 opacity-50" />;
  };

  const handleDelete = async (userId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      // Remove user from the list
      setUsers(users.filter(user => user.id !== userId));
      setShowDeleteDialog(false);
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while deleting the user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // --- JSX ---
  return (
     <div className="p-6 space-y-6">

       {/* --- Page Title and Add User Button --- */}
       <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
             User Management
           </h1>
           <p className="text-slate-500 mt-1">
             Manage and monitor all user accounts across the platform.
           </p>
         </div>
         <Link href="/admin/users/new">
           <Button
             className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md transition-all hover:shadow-lg w-full lg:w-auto"
           >
             <PlusCircle className="mr-2 h-4 w-4" />
             Add New User
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
                     placeholder="Search name, email..."
                     className="pl-9 h-10 w-full"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                 </div>
                 {/* Filter Dropdown */}
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="gap-2 h-10">
                       <Filter className="h-4 w-4" />
                       <span className="hidden sm:inline">Filters</span>
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuItem onClick={() => handleTypeFilter('all')}>All Types</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleTypeFilter('client')}>Clients Only</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleTypeFilter('vendor')}>Vendors Only</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleTypeFilter('driver')}>Drivers Only</DropdownMenuItem>
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
                     <SelectItem value="created_at">Date Added</SelectItem>
                     <SelectItem value="name">Name</SelectItem>
                     <SelectItem value="email">Email</SelectItem>
                     <SelectItem value="type">User Type</SelectItem>
                     <SelectItem value="status">Status</SelectItem>
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
                {(['all', 'active', 'pending', 'deleted'] as const).map(status => (
                  <Button
                     key={status}
                     variant={statusFilter === status ? "secondary" : "outline"}
                     onClick={() => handleStatusFilter(status)}
                     className={`capitalize ${
                       statusFilter === status
                       ? (status === 'all' ? 'bg-slate-700 text-white hover:bg-slate-800' : (statusConfig[status as UserStatus]?.className || '').replace('hover:bg-', 'bg-').replace('100', '200'))
                       : 'text-slate-600 hover:bg-slate-100'
                     } text-xs px-3 py-1 h-auto`}
                  >
                    {status.replace('_', ' ')}
                  </Button>
                ))}
             </div>
             
             {/* User Type Filter Buttons */}
             <div className="mt-2 flex flex-wrap gap-2">
                {(['all', 'client', 'vendor', 'driver', 'admin', 'helpdesk', 'super_admin'] as const).map(type => (
                  <Button
                     key={type}
                     variant={typeFilter === type ? "secondary" : "outline"}
                     onClick={() => handleTypeFilter(type)}
                     className={`capitalize ${
                       typeFilter === type
                       ? (type === 'all' ? 'bg-slate-700 text-white hover:bg-slate-800' : (userTypeConfig[type as UserType]?.className || '').replace('hover:bg-', 'bg-').replace('100', '200'))
                       : 'text-slate-600 hover:bg-slate-100'
                     } text-xs px-3 py-1 h-auto`}
                  >
                    {type.replace('_', ' ')}
                  </Button>
                ))}
             </div>
           </div>

           {/* --- Table Section --- */}
           <div className="mt-0">
             {isLoading ? (
                <LoadingSkeleton />
             ) : error ? (
               <div className="p-6 text-center">
                 <Alert variant="destructive" className="inline-flex flex-col items-center">
                   <AlertCircle className="h-5 w-5 mb-2" />
                   <AlertTitle>Error Fetching Users</AlertTitle>
                   <AlertDescription>{error}</AlertDescription>
                 </Alert>
               </div>
             ) : users.length > 0 ? (
               <div className="overflow-x-auto">
                 <Table>
                   <TableHeader>
                     <TableRow className="hover:bg-transparent bg-slate-50">
                       <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                         <div className="flex items-center"><User className="h-4 w-4 mr-1 text-slate-400" />User{getSortIcon("name")}</div>
                       </TableHead>
                       <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                         <div className="flex items-center">Type{getSortIcon("type")}</div>
                       </TableHead>
                       <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                         <div className="flex items-center"><Mail className="h-4 w-4 mr-1 text-slate-400" />Contact{getSortIcon("email")}</div>
                       </TableHead>
                       <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                         <div className="flex items-center">Status{getSortIcon("status")}</div>
                       </TableHead>
                       <TableHead className="cursor-pointer text-right" onClick={() => handleSort("created_at")}>
                         <div className="flex items-center justify-end"><Calendar className="h-4 w-4 mr-1 text-slate-400" />Created{getSortIcon("created_at")}</div>
                       </TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     <AnimatePresence>
                       {users.map((user) => {
                         // Safely get type configuration with fallback
                         const typeInfo = userTypeConfig[user.type] || { className: "bg-gray-100 text-gray-800", icon: null };
                         const statusInfo = statusConfig[user.status] || { className: "bg-gray-100 text-gray-800", icon: null };
                         
                         // Check if created_at is a valid date
                         const createdAtDate = new Date(user.createdAt);
                         const isValidDate = !isNaN(createdAtDate.getTime());

                         if (!isValidDate) {
                           console.error(`Invalid date for user ${user.id}:`, user.createdAt);
                         }

                         return (
                           <motion.tr
                             key={user.id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             transition={{ duration: 0.2 }}
                             className="group hover:bg-slate-50"
                           >
                             <TableCell>
                               <Link
                                 href={`/admin/users/${user.id}`}
                                 className="font-medium text-slate-800 hover:text-amber-600 transition-colors group-hover:underline"
                               >
                                 <div>{user.name || user.contact_name || 'Unnamed User'}</div>
                                 <div className="text-sm text-slate-500">{user.email}</div>
                               </Link>
                             </TableCell>
                             <TableCell>
                               <Badge className={`${typeInfo.className} flex items-center w-fit gap-1 px-2 py-0.5 font-semibold text-xs capitalize`}>
                                  {typeInfo.icon}
                                  {user.type.replace('_', ' ')}
                               </Badge>
                             </TableCell>
                             <TableCell className="text-sm text-slate-600">
                               <div className="flex items-center gap-1">
                                 <Phone className="h-3 w-3 text-slate-400" />
                                 {user.contact_number || <span className="text-slate-400 italic">No phone</span>}
                               </div>
                             </TableCell>
                             <TableCell>
                               <Badge className={`${statusInfo.className} flex items-center w-fit gap-1 px-2 py-0.5 font-semibold text-xs capitalize`}>
                                  {statusInfo.icon}
                                  {user.status}
                               </Badge>
                             </TableCell>
                             <TableCell className="text-right font-medium text-slate-600">
                               <div className="flex items-center justify-end gap-2">
                                 <span>
                                   {isValidDate
                                     ? createdAtDate.toLocaleDateString(undefined, {
                                         year: 'numeric',
                                         month: 'short',
                                         day: 'numeric',
                                         timeZone: 'UTC',
                                       })
                                     : 'Invalid Date'}
                                 </span>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   className="text-red-600 hover:bg-red-50 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                   onClick={() => {
                                     setUserToDelete(user);
                                     setShowDeleteDialog(true);
                                   }}
                                   disabled={user.type === 'super_admin'}
                                 >
                                   <AlertCircle className="h-4 w-4" />
                                   <span className="sr-only">Delete</span>
                                 </Button>
                               </div>
                             </TableCell>
                           </motion.tr>
                         );
                       })}
                     </AnimatePresence>
                   </TableBody>
                 </Table>
               </div>
             ) : (
               // --- Empty State ---
               <div className="flex flex-col items-center justify-center py-16 text-center">
                 <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                   <Users2 className="h-8 w-8 text-slate-400" />
                 </div>
                 <h3 className="text-lg font-semibold text-slate-800">No Users Found</h3>
                 <p className="text-slate-500 max-w-md mt-1">
                   No {statusFilter !== 'all' ? <span className="capitalize font-medium">{statusFilter}</span> : ''} 
                   {typeFilter !== 'all' && statusFilter !== 'all' ? ' ' : ''}
                   {typeFilter !== 'all' ? <span className="capitalize font-medium">{typeFilter}</span> : ''} 
                   users match your current filters. Try adjusting your search or filters.
                 </p>
                 <Link href="/admin/users/new" className="mt-4">
                   <Button variant="outline" className="mt-2">
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Add New User
                   </Button>
                 </Link>
               </div>
             )}

             {/* --- Pagination Section --- */}
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
                     {[...Array(totalPages)].map((_, i) => (
                       <PaginationItem key={`page-${i + 1}`}>
                         <PaginationLink
                           onClick={() => handlePageChange(i + 1)}
                           isActive={page === i + 1}
                           className={`cursor-pointer ${page === i + 1 ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold' : 'hover:bg-slate-200'}`}
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

       {/* Delete Confirmation Dialog */}
       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
             <AlertDialogDescription>
               This action will delete the user &quot;{userToDelete?.name || userToDelete?.email || 'Selected user'}&quot;. 
               This action cannot be undone.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
             <AlertDialogAction
               onClick={() => userToDelete && handleDelete(userToDelete.id)}
               disabled={isDeleting}
               className="bg-red-600 hover:bg-red-700 text-white"
             >
               {isDeleting ? "Deleting..." : "Delete"}
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
  );
};

export default UsersPage;