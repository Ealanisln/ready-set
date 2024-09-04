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

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  email: string;
  type: 'vendor' | 'client' | 'driver' | 'admin';
}

interface RecentUsersTableProps {
  users: User[];
}

export const RecentUsersTable: React.FC<RecentUsersTableProps> = ({ users }) => (
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
          <TableCell>{user.name || user.contact_name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <Badge variant="outline">{user.type}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);