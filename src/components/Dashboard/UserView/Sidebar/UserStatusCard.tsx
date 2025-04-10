// src/components/Dashboard/UserView/Sidebar/UserStatusCard.tsx

import { Controller } from "react-hook-form";
import { UserIcon, CheckCircle2, Clock, AlertCircle, ShieldAlert, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const isSuperAdmin = watchedValues.type?.toLowerCase() === "super_admin";
  
  // Status button configurations
  const statusConfigs = {
    active: {
      icon: CheckCircle2,
      colors: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      activeColors: "bg-emerald-600 text-white hover:bg-emerald-700"
    },
    pending: {
      icon: Clock,
      colors: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      activeColors: "bg-amber-600 text-white hover:bg-amber-700"
    },
    deleted: {
      icon: AlertCircle,
      colors: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      activeColors: "bg-red-600 text-white hover:bg-red-700"
    }
  };
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-8">
        <CardTitle className="flex items-center text-lg font-semibold">
          <UserIcon className="mr-2 h-5 w-5 text-primary" />
          User Status and Role
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Manage user account status and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="-mt-6 space-y-6 p-6">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 space-y-3">
            <Label className="text-sm font-medium text-slate-700">Status</Label>
            <div className="flex flex-wrap gap-2">
              {(["active", "pending", "deleted"] as const).map((status) => {
                const isActive = watchedValues.status?.toLowerCase() === status;
                const StatusIcon = statusConfigs[status].icon;
                const baseColors = statusConfigs[status].colors;
                const activeColors = statusConfigs[status].activeColors;

                return (
                  <Button
                    key={status}
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdatingStatus || loading}
                    className={`relative flex min-w-[100px] items-center justify-center gap-2 border px-4 py-2 font-medium transition-all ${
                      isActive ? activeColors : baseColors
                    }`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    <span className="capitalize">{status}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Role</Label>
            {isSuperAdmin ? (
              <div className="mt-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm ring-1 ring-blue-100">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Shield className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-medium text-blue-900">Super Admin</h4>
                    <p className="text-sm text-blue-600">Highest level of access</p>
                  </div>
                </div>
              </div>
            ) : (
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toLowerCase() ?? undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleRoleChange(value);
                    }}
                    disabled={loading || isUpdatingStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="helpdesk">Helpdesk</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {(userRole as string)?.toLowerCase() === "super_admin" && (
                        <SelectItem value="super_admin">
                          Super Admin
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}