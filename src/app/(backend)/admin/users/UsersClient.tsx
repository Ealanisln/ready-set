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

// Export the client component directly
const UsersClient: React.FC = () => {
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.warn("No active session found");
        }
        
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session ? `Bearer ${session.access_token}` : '',
          },
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
    setPage(1); // Reset to first page on filter change
  };

  const handleTypeFilter = (type: UserType | 'all') => {
    setTypeFilter(type);
    setPage(1); // Reset to first page on filter change
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1); // Reset to first page on sort change
  };

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null;
    
    return sortDirection === "asc" ? 
      <ChevronDown className="h-4 w-4 ml-1 text-amber-600" /> : 
      <ChevronDown className="h-4 w-4 ml-1 rotate-180 text-amber-600" />;
  };

  const handleDelete = async (userId: string) => {
    setIsDeleting(true);
    try {
      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : '',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete user: ${response.status}`);
      }

      // On success, remove user from local state
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        duration: 3000,
      });

    } catch (error) {
      console.error("Delete Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setUserToDelete(null);
      setShowDeleteDialog(false);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Toaster position="top-center" />
      
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col">
            {/* --- Header Section --- */}
            <div className="border-b bg-slate-50 p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <Users2 className="h-5 w-5 mr-2 text-amber-500" />
                  Users
                </h2>

                {/* --- Filter Dropdowns --- */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <Filter className="h-4 w-4 mr-1" />
                      Status
                      {statusFilter !== 'all' && <Badge variant="outline" className="ml-2 capitalize">{statusFilter}</Badge>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter('active')}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter('deleted')}>
                      Deleted
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Type
                      {typeFilter !== 'all' && <Badge variant="outline" className="ml-2 capitalize">{typeFilter}</Badge>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleTypeFilter('all')}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeFilter('vendor')}>
                      Vendor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeFilter('client')}>
                      Client
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeFilter('driver')}>
                      Driver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeFilter('admin')}>
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeFilter('helpdesk')}>
                      Helpdesk
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeFilter('super_admin')}>
                      Super Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                {/* --- Search Bar --- */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    className="pl-9 w-[200px] md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                
                {/* --- Add User Button --- */}
                <Link href="/admin/users/new">
                  <Button size="sm" className="whitespace-nowrap">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add User
                  </Button>
                </Link>
              </div>
            </div>

            {/* --- Error State --- */}
            {error && (
              <div className="p-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* --- Loading State --- */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : users.length > 0 ? (
              <div className="overflow-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="min-w-[200px] cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center">
                          <span>Name / Email</span>
                          {getSortIcon("name")}
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[100px] cursor-pointer" onClick={() => handleSort("type")}>
                        <div className="flex items-center">
                          <span>Type</span>
                          {getSortIcon("type")}
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[140px] cursor-pointer" onClick={() => handleSort("contact_number")}>
                        <div className="flex items-center">
                          <span>Phone</span>
                          {getSortIcon("contact_number")}
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[100px] cursor-pointer" onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          <span>Status</span>
                          {getSortIcon("status")}
                        </div>
                      </TableHead>
                      <TableHead className="text-right min-w-[140px] cursor-pointer" onClick={() => handleSort("createdAt")}>
                        <div className="flex items-center justify-end">
                          <span>Created</span>
                          {getSortIcon("createdAt")}
                        </div>
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

export default UsersClient; 