import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  const isSuperAdmin = currentUserRole === "super_admin";

  const availableRoles: UserType[] = [
    "vendor",
    "client",
    "driver",
    "admin",
    "helpdesk"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Status and Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value: UserStatus) => onStatusChange(value)}
              value={user.status}
              disabled={!isSuperAdmin}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="role">Role</Label>
            {isSuperAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{user.type || "Select Role"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableRoles.map((role) => (
                    <DropdownMenuItem 
                      key={role}
                      onClick={() => onRoleChange(role)}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div>{user.type}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatusCard;