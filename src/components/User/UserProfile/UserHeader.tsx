// src/components/Dashboard/UserView/UserHeader.tsx

"use client";

import React from "react";
import { UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserFormValues } from "./types";
import { cn } from "@/lib/utils";

interface UserHeaderProps {
  watchedValues: UserFormValues;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  watchedValues,
}) => {
  const { displayName, type, status, email } = watchedValues;

  // Status colors 
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300",
    suspended: "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300",
  };

  // Role colors
  const roleColors = {
    client: "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300",
    driver: "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300",
    vendor: "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300",
    admin: "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300",
    "super_admin": "bg-indigo-100 text-indigo-800 dark:bg-indigo-800/30 dark:text-indigo-300",
    helpdesk: "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-300",
  };

  // Get the appropriate role class based on the type
  const roleClass = type ? 
    roleColors[type as keyof typeof roleColors] || roleColors.client 
    : roleColors.client;

  // Get the appropriate status class based on the status
  const statusClass = status ? 
    statusColors[status as keyof typeof statusColors] || statusColors.pending
    : statusColors.pending;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <UserCircle className="h-12 w-12 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {displayName || "User Profile"}
          </h2>
          {email && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{email}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
        {type && (
          <Badge className={cn("font-medium rounded-md px-2.5 py-1 capitalize", roleClass)}>
            {type.toLowerCase().replace("_", " ")}
          </Badge>
        )}
        {status && (
          <Badge className={cn("font-medium rounded-md px-2.5 py-1 capitalize", statusClass)}>
            {status.toLowerCase()}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default UserHeader;