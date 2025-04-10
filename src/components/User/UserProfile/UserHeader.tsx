// src/components/Dashboard/UserView/UserHeader.tsx

import { Building, User as UserIcon, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserFormValues, USER_TYPE_COLORS, USER_STATUS_COLORS } from "./types";

interface UserHeaderProps {
  watchedValues: UserFormValues;
  className?: string;
}

export default function UserHeader({ watchedValues, className }: UserHeaderProps) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
            {watchedValues.type === "vendor" ||
            watchedValues.type === "client" ? (
              <Building className="h-6 w-6" />
            ) : (
              <UserIcon className="h-6 w-6" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {watchedValues.displayName || "New User"}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              <Badge
                variant="outline"
                className={`font-medium capitalize ${
                  watchedValues.type
                    ? USER_TYPE_COLORS[watchedValues.type]
                    : "border-gray-200 bg-gray-100 text-gray-800"
                }`}
              >
                {watchedValues.type
                  ? watchedValues.type.replace("_", " ")
                  : "N/A"}
              </Badge>
              <Badge
                variant="outline"
                className={`font-medium capitalize ${
                  watchedValues.status
                    ? USER_STATUS_COLORS[watchedValues.status]
                    : USER_STATUS_COLORS.pending
                }`}
              >
                {watchedValues.status || "pending"}
              </Badge>
              {watchedValues.email && (
                <span className="flex items-center text-slate-500">
                  <Mail className="mr-1 h-3.5 w-3.5" />
                  {watchedValues.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}