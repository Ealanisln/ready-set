"use client";

import React, { useEffect, useState } from "react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserTable } from "./UserTable";
import { UserFilter } from "./UserFilter";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  contact_number: string;
  email: string;
  type: "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";
  created_at?: Date;
}

interface MainContentProps {
  users: User[];
  filter: string | null;
  setFilter: (filter: string | null) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  users,
  filter,
  setFilter,
}) => {
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "super_admin">("admin");
  const [paginationInfo, setPaginationInfo] = useState({
    start: 0,
    end: 0,
    total: 0,
  });

  const filteredUsers = filter
    ? users.filter((user) => user.type === filter)
    : users;

  const handlePaginationChange = (
    start: number,
    end: number,
    total: number,
  ) => {
    setPaginationInfo({ start, end, total });
  };

  const { data: session } = useSession();

  console.log(session)

  const handleRoleChange = async (userId: string, newRole: User["type"]) => {
    try {
      // Implement the API call to change the user's role
      const response = await fetch(`/api/users/${userId}/change-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to change user role");
      }

      // You might want to trigger a re-fetch of users here or update the parent state
      // For now, we'll just log a success message
      console.log(`User ${userId} role updated to ${newRole}`);
    } catch (error) {
      console.error("Error changing user role:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <UserFilter filter={filter} setFilter={setFilter} />
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                <Link href="/signup">Add User</Link>
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your users and edit their information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable
                users={filteredUsers}
                onPaginationChange={handlePaginationChange}
                currentUserRole={currentUserRole}
              />
            </CardContent>
            <CardFooter>
              <div className="text-muted-foreground text-xs">
                Showing{" "}
                <strong>
                  {paginationInfo.start}-{paginationInfo.end}
                </strong>{" "}
                of <strong>{paginationInfo.total}</strong> Users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};
