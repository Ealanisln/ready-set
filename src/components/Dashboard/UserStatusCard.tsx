import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Define the user status type based on your schema
type UserStatus = "active" | "pending" | "deleted";

// Define the props interface for the component
interface UserStatusCardProps {
  user: {
    id: string;
    status?: "active" | "pending" | "deleted";
  };
  onStatusChange: (
    newStatus: "active" | "pending" | "deleted",
  ) => Promise<void>;
}

const UserStatusCard: React.FC<UserStatusCardProps> = ({
  user,
  onStatusChange,
}) => {
  const [status, setStatus] = useState(user.status || "pending");

  const handleStatusChange = async (
    newStatus: "active" | "pending" | "deleted",
  ) => {
    try {
      await onStatusChange(newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={handleStatusChange} value={status}>
              <SelectTrigger id="status" aria-label="Select status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default UserStatusCard;
