// components/UserFilter.tsx
import React from 'react';
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserFilterProps {
  filter: string | null;
  setFilter: (filter: string | null) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({ filter, setFilter }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Filter
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filter === null}
          onClick={() => setFilter(null)}
        >
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filter === "driver"}
          onClick={() => setFilter("driver")}
        >
          Driver
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filter === "client"}
          onClick={() => setFilter("client")}
        >
          Client
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filter === "vendor"}
          onClick={() => setFilter("vendor")}
        >
          Vendor
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};