// src/components/Dashboard/ui/RecentUsersTable.tsx

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, UserType } from "@/types/user"; // Import the shared type

interface RecentUsersTableProps {
  users: User[];
}

export const RecentUsersTable: React.FC<RecentUsersTableProps> = ({ users }) => {
  // Function to determine badge color based on user type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case UserType.ADMIN:
      case UserType.SUPER_ADMIN:
        return "default";
      case UserType.VENDOR:
        return "secondary";
      case UserType.CLIENT:
        return "outline";
      case UserType.DRIVER:
        return "destructive";
      case UserType.HELPDESK:
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              <Link href={`/admin/users/${user.id}`} className="hover:underline">
                {user.name || user.contact_name || "Unnamed User"}
              </Link>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(user.type)}>
                {user.type}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};