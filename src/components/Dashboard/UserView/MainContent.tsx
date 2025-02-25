"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import Link from "next/link";
import { PlusCircle, Users2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
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
  onDelete: (userId: string) => Promise<void>;
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
    <div className="h-10 animate-pulse rounded bg-gray-100" />
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-16 animate-pulse rounded bg-gray-50"
        style={{ animationDelay: `${i * 100}ms` }}
      />
    ))}
  </div>
);

export const MainContent: React.FC<MainContentProps> = ({
  users: initialUsers,
  filter,
  setFilter,
  onDelete,
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("active");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const getFilteredUsers = useCallback(() => {
    return (
      users?.filter((user) => {
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
      }) ?? []
    );
  }, [users, filter, activeTab, searchTerm]);

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(userToDelete.id);
      setShowDeleteDialog(false);
      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

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
      totalPages: Math.ceil(total / itemsPerPage),
    };
  }, [currentPage, itemsPerPage, getFilteredUsers]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const { start, end, total, currentItems, totalPages } =
    calculatePaginationInfo();

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all user accounts across the platform.
          </p>
        </div>
        <Button
          asChild
          className="bg-yellow-400 text-white hover:bg-yellow-500"
        >
          <Link
            href="/admin/users/new-user"
            className="inline-flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
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
            <TabsList className="bg-muted/50 grid grid-cols-4 gap-4 p-1">
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="deleted"
                className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
              >
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
                        <tr className="bg-muted/50 border-b">
                          <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                            User
                          </th>
                          <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                            Type
                          </th>
                          <th className="text-muted-foreground hidden h-12 px-4 text-left align-middle font-medium md:table-cell">
                            Contact
                          </th>
                          <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                            Status
                          </th>
                          <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                          Created At
                          </th>
                          <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                         Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-muted/50 border-b transition-colors"
                          >
                            <td className="p-4">
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="hover:underline"
                              >
                                <div className="font-medium">
                                  {user.name || user.contact_name}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {user.email}
                                </div>
                              </Link>
                            </td>

                            <td className="p-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${userTypeColors[user.type]}`}
                              >
                                {user.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="hidden p-4 md:table-cell">
                              <div className="text-sm">
                                {user.contact_number}
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[user.status]}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="p-4">
                             {user.created_at ? (
                              <div className="text-sm">
                                {new Date(user.created_at).toISOString().replace('T', ' ').slice(0, 23)}
                              </div>
                            ) : (
                              <div className="text-muted-foreground text-sm">N/A</div>
                            )}
                          </td>
                          <td className="p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => {
                                  setUserToDelete(user);
                                  setShowDeleteDialog(true);
                                }}
                                disabled={user.type === "super_admin"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
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
                          variant={
                            currentPage === i + 1 ? "default" : "outline"
                          }
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
                  <Users2 className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="text-lg font-semibold">No users found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No users match your search criteria"
                      : `No ${activeTab !== "all" ? activeTab : ""} users available.`}
                  </p>
                </div>
              )}

              <div className="text-muted-foreground text-xs">
                Showing {start}-{end} of {total} users
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete{" "}
              {userToDelete?.name || userToDelete?.email}&apos;s account and
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
