// src/components/Dashboard/UserView/Sidebar/UserStatusCard.tsx

import { Controller } from "react-hook-form";
import { UserIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserFormValues } from "../types";
import { Control } from "react-hook-form";
import { useUser } from "@/contexts/UserContext";

interface UserStatusCardProps {
  watchedValues: UserFormValues;
  control: Control<UserFormValues>;
  isUpdatingStatus: boolean;
  loading: boolean;
  handleStatusChange: (status: NonNullable<UserFormValues["status"]>) => Promise<void>;
  handleRoleChange: (role: string) => Promise<void>;
}

export default function UserStatusCard({
  watchedValues,
  control,
  isUpdatingStatus,
  loading,
  handleStatusChange,
  handleRoleChange
}: UserStatusCardProps) {
  const { userRole } = useUser();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-8">
        <CardTitle className="flex items-center">
          <UserIcon className="mr-2 h-5 w-5 text-primary" />
          User Status and Role
        </CardTitle>
        <CardDescription>
          Manage user account status and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="-mt-6 space-y-6 p-6">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 space-y-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {(["active", "pending", "deleted"] as const).map(
                (status) => (
                  <Button
                    key={status}
                    variant={
                      watchedValues.status === status
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdatingStatus || loading}
                    className={`capitalize ${
                      watchedValues.status === status
                        ? "text-primary-foreground bg-primary hover:bg-primary/90"
                        : ""
                    }`}
                  >
                    {status === "active" && (
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {status === "pending" && (
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {status === "deleted" && (
                      <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {status}
                  </Button>
                ),
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>Role</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? undefined}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleRoleChange(value);
                  }}
                  disabled={loading || isUpdatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="helpdesk">Helpdesk</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {(userRole as string) === "super_admin" && (
                      <SelectItem value="super_admin">
                        Super Admin
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}