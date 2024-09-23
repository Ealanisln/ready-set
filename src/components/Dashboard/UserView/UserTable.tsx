"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { PaginationWrapper } from './PaginationWrapper'; 

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  contact_number: string;
  email: string;
  type: "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";
  created_at?: Date;
}

interface UserTableProps {
  users: User[];
  onPaginationChange: (start: number, end: number, total: number) => void;
  currentUserRole: "admin" | "super_admin";
  onRoleChange: (userId: string, newRole: User['type']) => Promise<void>;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onPaginationChange, 
  currentUserRole,
  onRoleChange 
}) => {
  const [sortColumn, setSortColumn] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleSort = (column: keyof User) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedUsers = useMemo(() => {
    const sortUsers = (a: User, b: User) => {
      const getName = (user: User) => (user.name || user.contact_name || '').toLowerCase();
      const valueA = sortColumn === 'name' ? getName(a) : ((a[sortColumn] as string) || '').toLowerCase();
      const valueB = sortColumn === 'name' ? getName(b) : ((b[sortColumn] as string) || '').toLowerCase();
      
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    };
  
    return [...users].sort(sortUsers);
  }, [users, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedUsers.length);
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newStartIndex = (page - 1) * itemsPerPage;
    const newEndIndex = Math.min(newStartIndex + itemsPerPage, sortedUsers.length);
    onPaginationChange(newStartIndex + 1, newEndIndex, sortedUsers.length);
  };

  const handleRoleChange = async (userId: string, newRole: User['type']) => {
    try {
      await onRoleChange(userId, newRole);
      // Optionally, you can update the local state here if needed
    } catch (error) {
      console.error("Failed to change user role:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => toggleSort('name')}>
              Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => toggleSort('type')}>
              Type {sortColumn === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="hidden md:table-cell" onClick={() => toggleSort('contact_number')}>
              Phone {sortColumn === 'contact_number' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="hidden md:table-cell" onClick={() => toggleSort('email')}>
              E-mail {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="hidden md:table-cell" onClick={() => toggleSort('created_at')}>
              Created at {sortColumn === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link href={`/admin/users/${user.id}`}>
                  {user.name || user.contact_name || "N/A"}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{user.type}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.contact_number ? user.contact_number : "None"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.email}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-haspopup="true"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Link href={`/admin/users/${user.id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    {currentUserRole === "super_admin" && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {["vendor", "client", "driver", "admin", "helpdesk"].map((role) => (
                            <DropdownMenuItem 
                              key={role}
                              onClick={() => handleRoleChange(user.id, role as User['type'])}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};