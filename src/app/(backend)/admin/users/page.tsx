"use client";
import React, { useEffect, useState } from "react";
import { BreadcrumbNavigation } from "@/components/Dashboard/UserView/BreadCrumbNavigation";
import { MainContent } from "@/components/Dashboard/UserView/MainContent";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

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

export default function Users() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  // Fetch Supabase session
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    fetchSession();
  }, [supabase]);

  useEffect(() => {
    // Check if user is authenticated and is a super_admin
    if (!session) {
      router.push('/login?redirect=/admin/users');
      return;
    }
    
    // Check if user has super_admin role in metadata
    const userType = session.user.user_metadata?.type;
    if (userType !== 'super_admin') {
      router.push('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.map((user: User) => ({
          ...user,
          status: user.status || "active",
        })));
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [session, router, toast, supabase]);

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/delete-user?id=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user.id !== userId));
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

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