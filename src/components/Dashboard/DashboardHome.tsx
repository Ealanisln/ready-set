"use client";

import React, { useState, useEffect } from "react";
import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";

import { useDashboardMetrics } from "@/components/Dashboard/DashboardMetrics";
import { MetricCard } from "./ui/MetricCard";
import { RecentOrdersTable } from "./ui/RecentOrders";
import { RecentUsersTable } from "./ui/RecentUsersTable";
import { DashboardCard } from "./ui/DashboardCard";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

interface CateringOrder {
  id: string;
  order_number: string;
  status: string;
  order_total: string | number;
  order_type: string;
}

interface User {
  id: string;
  name?: string;
  contact_name?: string;
  contact_number: string;
  email: string;
  type: "vendor" | "client" | "driver" | "admin";
  created_at?: string;
}

export function DashboardHome() {
  const [recentOrders, setRecentOrders] = useState<CateringOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
  } = useDashboardMetrics();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, usersResponse] = await Promise.all([
          fetch("/api/orders/catering-orders?recentOnly=true"),
          fetch("/api/users"),
        ]);

        if (!ordersResponse.ok || !usersResponse.ok) {
          throw new Error("One or more network responses were not ok");
        }

        const [ordersData, usersData] = await Promise.all([
          ordersResponse.json(),
          usersResponse.json(),
        ]);

        setRecentOrders(ordersData);
        setUsers(usersData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (metricsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading metrics...</p>
      </div>
    );
  }

  if (metricsError) {
    return <div>Error loading metrics: {metricsError}</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col sm:pl-14">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            change="+20.1% from last month"
          />
          <MetricCard
            title="Deliveries Requests"
            value={`+${metrics.deliveriesRequests}`}
            icon={Users}
            change="+180.1% from last month"
          />
          {/* <MetricCard
            title="Sales Totals"
            value={`+${metrics.salesTotal}`}
            icon={TrendingUp}
            change="+180.1% from last month"
          /> */}
          <MetricCard
            title="Total Vendors"
            value={`+${metrics.totalVendors}`}
            icon={Activity}
            change="+180.1% from last month"
          />
          <Card className="w-full max-w-sm">
            <CardContent className="space-y-2 pt-6">
              <Link href="/catering-request" className="block w-full">
                <Button className="w-full">Create new order</Button>
              </Link>
              {/* <Link href="#" className="block w-full">
                <Button className="w-full" variant="ghost">
                  New user
                </Button>
              </Link> */}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <DashboardCard
            title="Recent Catering Orders"
            linkText="View Catering Orders"
            linkHref="/admin/catering-orders"
          >
            <RecentOrdersTable orders={recentOrders} />
          </DashboardCard>
          <DashboardCard
            title="Recent Users"
            linkText="View All Users"
            linkHref="/admin/users"
          >
            <RecentUsersTable users={users.slice(0, 5)} />
          </DashboardCard>
        </div>
      </main>
    </div>
  );
}
