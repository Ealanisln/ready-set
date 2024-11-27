"use client";

import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { PlusCircle, Users2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { UserFilter } from "./UserFilter";

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  contact_number: string;
  email: string;
  type: "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";
  created_at?: Date;
  status: "active" | "pending" | "deleted";
}

interface MainContentProps {
  users: User[];
  filter: string | null;
  setFilter: Dispatch<SetStateAction<string | null>>;
}

const userTypeColors = {
  vendor: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  client: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  driver: "bg-green-100 text-green-800 hover:bg-green-200",
  admin: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  helpdesk: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  super_admin: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  deleted: "bg-red-100 text-red-800",
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <div className="h-10 bg-gray-100 rounded animate-pulse" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-50 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
    ))}
  </div>
);

export const MainContent: React.FC<MainContentProps> = ({
  users: initialUsers,
  filter,
  setFilter,
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();
  const { data: session } = useSession();

  const getFilteredUsers = useCallback(() => {
    return users?.filter((user) => {
      if (!user) return false;
      if (filter && user.type !== filter) return false;
      if (activeTab === "all") return true;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.contact_name?.toLowerCase().includes(searchLower)
        );
      }
      return user.status === activeTab;
    }) ?? [];
  }, [users, filter, activeTab, searchTerm]);

  const calculatePaginationInfo = useCallback(() => {
    const filteredUsers = getFilteredUsers();
    const total = filteredUsers.length;
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, total);

    return {
      start: total > 0 ? start + 1 : 0,
      end,
      total,
      currentItems: filteredUsers.slice(start, end),
      totalPages: Math.ceil(total / itemsPerPage)
    };
  }, [currentPage, itemsPerPage, getFilteredUsers]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, activeTab, searchTerm]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const { start, end, total, currentItems, totalPages } = calculatePaginationInfo();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all user accounts across the platform.
          </p>
        </div>
        <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-white">
          <Link href="/admin/users/new-user" className="inline-flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <UserFilter filter={filter} setFilter={setFilter} />
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="active" 
            className="space-y-4" 
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4 gap-4 bg-muted/50 p-1">
              <TabsTrigger value="active" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
                Active
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900">
                Pending
              </TabsTrigger>
              <TabsTrigger value="deleted" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">
                Deleted
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {loading ? (
                <LoadingSkeleton />
              ) : currentItems.length > 0 ? (
                <>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((user) => (
                          <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4">
                              <Link 
                                href={`/admin/users/${user.id}`}
                                className="hover:underline"
                              >
                                <div className="font-medium">{user.name || user.contact_name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </Link>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${userTypeColors[user.type]}`}>
                                {user.type.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <div className="text-sm">{user.contact_number}</div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[user.status]}`}>
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No users found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "No users match your search criteria" 
                      : `No ${activeTab !== 'all' ? activeTab : ''} users available.`}
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Showing {start}-{end} of {total} users
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};