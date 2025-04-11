"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { UserType, UserStatus } from "@/types/user";
import { toast } from "react-hot-toast";

interface UserSettingsTabProps {
  userId: string;
  initialUserData?: {
    type: UserType;
    status: UserStatus;
    isTemporaryPassword: boolean;
  };
  isSuperAdmin?: boolean;
}

export const UserSettingsTab: React.FC<UserSettingsTabProps> = ({
  userId,
  initialUserData,
  isSuperAdmin = false
}) => {
  const [userType, setUserType] = useState<UserType | null>(initialUserData?.type || null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(initialUserData?.status || null);
  const [tempPassword, setTempPassword] = useState<boolean>(initialUserData?.isTemporaryPassword || false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    if (!initialUserData) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/users/${userId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.statusText}`);
          }
          
          const userData = await response.json();
          setUserType(userData.type);
          setUserStatus(userData.status);
          setTempPassword(userData.isTemporaryPassword);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user settings");
        }
      };
      
      fetchUserData();
    }
  }, [initialUserData, userId]);

  const handleUserTypeChange = (value: UserType) => {
    setUserType(value);
    setHasChanges(true);
  };

  const handleUserStatusChange = (value: UserStatus) => {
    setUserStatus(value);
    setHasChanges(true);
  };

  const handleTempPasswordChange = (checked: boolean) => {
    setTempPassword(checked);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!userType || !userStatus) {
      toast.error("User type and status are required");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/${userId}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: userType,
          status: userStatus,
          isTemporaryPassword: tempPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user settings");
      }

      toast.success("User settings updated successfully");
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating user settings:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administrative Settings</CardTitle>
        <CardDescription>
          {isSuperAdmin 
            ? "Manage user role, status, and password settings" 
            : "View user administrative settings"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="user-type">User Role</Label>
          <Select
            value={userType || undefined}
            onValueChange={(value) => handleUserTypeChange(value as UserType)}
            disabled={!isSuperAdmin || isUpdating}
          >
            <SelectTrigger id="user-type">
              <SelectValue placeholder="Select user role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserType.SUPER_ADMIN}>Super Admin</SelectItem>
              <SelectItem value={UserType.HELPDESK}>Helpdesk</SelectItem>
              <SelectItem value={UserType.CLIENT}>Client</SelectItem>
              <SelectItem value={UserType.VENDOR}>Vendor</SelectItem>
              <SelectItem value={UserType.DRIVER}>Driver</SelectItem>
            </SelectContent>
          </Select>
          {!isSuperAdmin && (
            <p className="text-sm text-muted-foreground mt-1">
              Only Super Admins can change user roles
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-status">Account Status</Label>
          <Select
            value={userStatus || undefined}
            onValueChange={(value) => handleUserStatusChange(value as UserStatus)}
            disabled={!isSuperAdmin || isUpdating}
          >
            <SelectTrigger id="user-status">
              <SelectValue placeholder="Select account status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={UserStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={UserStatus.DELETED}>Deleted</SelectItem>
            </SelectContent>
          </Select>
          {!isSuperAdmin && (
            <p className="text-sm text-muted-foreground mt-1">
              Only Super Admins can change account status
            </p>
          )}
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div>
            <Label htmlFor="temp-password" className="text-base">Require Password Reset</Label>
            <p className="text-sm text-muted-foreground">
              User will be prompted to set a new password on next login
            </p>
          </div>
          <Switch
            id="temp-password"
            checked={tempPassword}
            onCheckedChange={handleTempPasswordChange}
            disabled={!isSuperAdmin || isUpdating}
          />
        </div>

        {isSuperAdmin && (
          <Button 
            className="w-full mt-4" 
            onClick={handleSaveChanges} 
            disabled={!hasChanges || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}; 