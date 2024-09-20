"use client";

import React, { useState, useEffect } from 'react';
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
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  contact_number: string;
  email: string;
  type: "vendor" | "client" | "driver" | "admin" | "helpdesk";
  created_at?: Date;
}

interface UserTableProps {
  users: User[];
  onPaginationChange: (start: number, end: number, total: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onPaginationChange }) => {
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

  const sortUsers = (a: User, b: User) => {
    const getName = (user: User) => (user.name || user.contact_name || '').toLowerCase();
    const valueA = sortColumn === 'name' ? getName(a) : ((a[sortColumn] as string) || '').toLowerCase();
    const valueB = sortColumn === 'name' ? getName(b) : ((b[sortColumn] as string) || '').toLowerCase();
    
    return sortDirection === 'asc' 
      ? valueA.localeCompare(valueB) 
      : valueB.localeCompare(valueA);
  };

  const sortedUsers = [...users].sort(sortUsers);

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedUsers.length);
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  useEffect(() => {
    onPaginationChange(startIndex + 1, endIndex, sortedUsers.length);
  }, [currentPage, sortedUsers, onPaginationChange, startIndex, endIndex]);

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
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};