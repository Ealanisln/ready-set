"use client";

import React from "react";
import { Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/types/job-application";

type StatusBadgeProps = {
  status: ApplicationStatus;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    [ApplicationStatus.PENDING]: {
      label: "Pending",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
      icon: <Clock className="h-3 w-3 mr-1" />
    },
    [ApplicationStatus.APPROVED]: {
      label: "Approved",
      className: "bg-green-100 text-green-700 border border-green-200",
      icon: <CheckCircle className="h-3 w-3 mr-1" />
    },
    [ApplicationStatus.REJECTED]: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 border border-red-200",
      icon: <XCircle className="h-3 w-3 mr-1" />
    },
    [ApplicationStatus.INTERVIEWING]: {
      label: "Interviewing",
      className: "bg-indigo-100 text-indigo-700 border border-indigo-200",
      icon: <Users className="h-3 w-3 mr-1" />
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      <span className="flex items-center">
        {config.icon}
        {config.label}
      </span>
    </Badge>
  );
}; 