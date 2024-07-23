// components/MainContent.tsx
import React from "react";
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

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  contact_number: string;
  email: string;
  type: "vendor" | "client" | "driver" | "admin";
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
  const filteredUsers = filter
    ? users.filter((user) => user.type === filter)
    : users;

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
                Manage your users and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={filteredUsers} />
            </CardContent>
            <CardFooter>
              <div className="text-muted-foreground text-xs">
                Showing <strong>1-{Math.min(filteredUsers.length, 10)}</strong>{" "}
                of <strong>{filteredUsers.length}</strong> Users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};
