"use client";
import React, { useEffect, useState, useCallback } from "react";
import { BreadcrumbNavigation } from "@/components/Dashboard/UserView/BreadCrumbNavigation";
import { MainContent } from "@/components/Dashboard/UserView/MainContent";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";

// Define UserType to ensure consistency
type UserType = "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  contact_number: string;
  email: string;
  type: UserType;
  created_at?: Date;
  status: "active" | "pending" | "deleted";
}

export default function Users() {
  const router = useRouter();
  const { toast } = useToast();
  const { session, userRole, isLoading: isUserLoading } = useUser();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    if (isUserLoading || !session) return;
    
    try {
      setLoading(true);
      
      // First check if user has permission to view this page
      // Ensure proper type checking by explicitly casting or type guarding userRole
      const role = userRole as UserType | null; // Cast to match our expected types
      
      if (role !== "super_admin" && role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this page",
          variant: "destructive",
        });
        router.push("/");
        return;
      }
      
      // Then fetch users list
      const response = await fetch("/api/users", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "x-request-source": "UsersListComponent",
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(
        data.map((user: User) => ({
          ...user,
          status: user.status || "active",
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : String(error));
      toast({
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [session, userRole, isUserLoading, router, toast]);

  // Load data once authentication is initialized
  useEffect(() => {
    if (!isUserLoading) {
      fetchUsers();
    }
  }, [fetchUsers, isUserLoading]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !session) {
      router.push("/login?redirect=/admin/users");
    }
  }, [session, isUserLoading, router]);

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/delete-user?id=${userId}`, {
        method: "DELETE",
        headers: {
          "x-request-source": "UsersListComponent-Delete",
        }
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (isUserLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  // No session - will be redirected by the effect
  if (!session) return null;

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <BreadcrumbNavigation />
        </header>
        <MainContent
          users={users}
          filter={filter}
          setFilter={setFilter}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}