"use client";

import React from "react";
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JobApplicationStats } from "@/types/job-application";

type StatsOverviewProps = {
  stats: JobApplicationStats;
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-blue-100 p-3">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <h3 className="text-2xl font-bold">{stats.pendingApplications}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Approved</p>
            <h3 className="text-2xl font-bold">{stats.approvedApplications}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-red-100 p-3">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Rejected</p>
            <h3 className="text-2xl font-bold">{stats.rejectedApplications}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-indigo-100 p-3">
            <CalendarCheck className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Interviewing</p>
            <h3 className="text-2xl font-bold">{stats.interviewingApplications}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 