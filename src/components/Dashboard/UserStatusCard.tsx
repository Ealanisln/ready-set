"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type UserType = "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";
type UserStatus = "active" | "pending" | "deleted";

interface UserStatusCardProps {
  user: {
    id: string;
    status?: UserStatus;
    type: UserType;
  };
  onStatusChange: (newStatus: UserStatus) => Promise<void>;
  onRoleChange: (newRole: UserType) => Promise<void>;
  currentUserRole: UserType;
}

const UserStatusCard: React.FC<UserStatusCardProps> = ({
  user,
  onStatusChange,
  onRoleChange,
  currentUserRole,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<UserStatus | undefined>(user.status);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // This checks if currentUserRole is actually "super_admin"
  const isSuperAdmin = currentUserRole === "super_admin";
  
  // Log whenever the component renders to debug
  useEffect(() => {
    console.log("UserStatusCard rendered with:", {
      userId: user.id,
      userType: user.type,
      userStatus: user.status,
      currentUserRole,
      isSuperAdmin
    });
  }, [user.id, user.type, user.status, currentUserRole, isSuperAdmin]);

  const availableRoles: UserType[] = [
    "vendor",
    "client",
    "driver",
    "admin",
    "helpdesk"
  ];

  // Safe handler for status changes with loading state
  const handleStatusChange = async (value: string) => {
    if (!value) return;
    
    const newStatus = value as UserStatus;
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    setErrorMessage(null);
    
    try {
      console.log(`Attempting to update status to: ${newStatus}`);
      await onStatusChange(newStatus);
      setCurrentStatus(newStatus);
      console.log("Status update successful");
    } catch (error) {
      console.error("Failed to update status:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Role change handler with feedback
  const handleRoleChange = async (role: UserType) => {
    if (role === user.type) return;
    
    setIsUpdating(true);
    setErrorMessage(null);
    
    try {
      console.log(`Attempting to update role to: ${role}`);
      await onRoleChange(role);
      console.log("Role update successful");
    } catch (error) {
      console.error("Failed to update role:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setIsUpdating(false);
    }
  };

  // Force a status update to verify permissions
  const testPermissions = async () => {
    setIsUpdating(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch("/api/users/test-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Permission test failed");
      }
      
      console.log("Permission test result:", data);
      setErrorMessage(`Your actual role: ${data.userRole}`);
    } catch (error) {
      console.error("Permission test failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Permission test failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Status and Role</CardTitle>
        <CardDescription>
          {isSuperAdmin 
            ? "You can change both status and role as a super admin" 
            : "You can view but not change these settings"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={handleStatusChange}
              value={currentStatus}
              disabled={!isSuperAdmin || isUpdating}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status">
                  {isUpdating ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    currentStatus || "Select status"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
            {!isSuperAdmin && (
              <p className="text-sm text-muted-foreground mt-1">
                Your current role is: {currentUserRole} 
                (You need to be a super_admin to edit)
              </p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Role</Label>
            {isSuperAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isUpdating} className="w-full justify-start">
                    {isUpdating ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      user.type?.charAt(0).toUpperCase() + user.type?.slice(1) || "Select Role"
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableRoles.map((role) => (
                    <DropdownMenuItem 
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      disabled={role === user.type}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="p-2 border rounded-md">
                {user.type?.charAt(0).toUpperCase() + user.type?.slice(1) || "Not set"}
              </div>
            )}
          </div>
        </div>
        
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">
            Debug info: Your role is {currentUserRole} (isSuperAdmin: {isSuperAdmin ? "Yes" : "No"})
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testPermissions}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </div>
            ) : (
              "Test Permissions"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserStatusCard;