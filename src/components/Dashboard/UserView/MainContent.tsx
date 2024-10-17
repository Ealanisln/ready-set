"use client";

import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "./UserTable";
import { UserFilter } from "./UserFilter";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

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

export const MainContent: React.FC<MainContentProps> = ({
  users: initialUsers,
  filter,
  setFilter,
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [paginationInfo, setPaginationInfo] = useState({
    start: 0,
    end: 0,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();
  const { data: session } = useSession();

  const currentUserRole = session?.user?.type === "super_admin" ? "super_admin" : "admin";

  const filteredUsers = users?.filter((user) => {
    if (!user) return false;
    if (filter && user.type !== filter) return false;
    if (activeTab === "all") return true;
    return user.status === activeTab;
  }) ?? [];

  const handlePaginationChange = (
    start: number,
    end: number,
    total: number,
  ) => {
    setPaginationInfo({ start, end, total });
  };

  const fetchUsers = useCallback(async () => {
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
    }
  }, [toast]);

  const handleUserDeleted = useCallback(() => {
    fetchUsers();
    toast({
      title: "User deleted",
      description: "The user has been successfully removed.",
    });
  }, [fetchUsers, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const renderTabContent = (tabValue: string, title: string) => (
    <TabsContent value={tabValue}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Manage your {tabValue === "all" ? "" : `${tabValue} `}users and edit their information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredUsers}
            onPaginationChange={handlePaginationChange}
            currentUserRole={currentUserRole}
            onUserDeleted={handleUserDeleted}
          />
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground text-xs">
            Showing{" "}
            <strong>
              {paginationInfo.start}-{paginationInfo.end}
            </strong>{" "}
            of <strong>{paginationInfo.total}</strong> {tabValue === "all" ? "" : `${tabValue} `}Users
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <UserFilter filter={filter} setFilter={setFilter} />
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                <Link href="/admin/users/new-user">Add User</Link>
              </span>
            </Button>
          </div>
        </div>
        {renderTabContent("active", "Active Users")}
        {renderTabContent("pending", "Pending Users")}
        {renderTabContent("deleted", "Deleted Users")}
        {renderTabContent("all", "All Users")}
      </Tabs>
    </main>
  );
};