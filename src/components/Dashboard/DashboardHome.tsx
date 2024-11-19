"use client";

import React, { useState, useEffect } from "react";
import { Activity, ClipboardList, Users } from "lucide-react";
import { useDashboardMetrics } from "@/components/Dashboard/DashboardMetrics";
import { MetricCard } from "./ui/MetricCard";
import { RecentOrdersTable } from "./ui/RecentOrders";
import { RecentUsersTable } from "./ui/RecentUsersTable";
import { DashboardCard } from "./ui/DashboardCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [activeOrders, setActiveOrders] = useState<CateringOrder[]>([]);
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
        const filteredActiveOrders = ordersData.filter(
          (order: CateringOrder) => order.status === "active"
        );
        setActiveOrders(filteredActiveOrders);
        setUsers(usersData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || metricsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-yellow-50/50">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
          <p className="text-lg font-semibold text-yellow-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || metricsError) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <p className="text-red-600">Error: {error || metricsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-yellow-50/30 to-white sm:pl-14">
      <main className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Orders"
            value={activeOrders.length}
            icon={ClipboardList}
            change={`${((activeOrders.length / recentOrders.length) * 100).toFixed(1)}% of total orders`}
          />
          <MetricCard
            title="Deliveries Requests"
            value={`+${metrics.deliveriesRequests}`}
            icon={Users}
            change="+180.1% from last month"
          />
          <MetricCard
            title="Total Vendors"
            value={`+${metrics.totalVendors}`}
            icon={Activity}
            change="+180.1% from last month"
          />
          <Card className="h-[140px] flex flex-col justify-center">
            <CardContent className="space-y-3">
              <Link href="/catering-request" className="block w-full">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white">
                  Create new order
                </Button>
              </Link>
              <Link href="/admin/users/new-user" className="block w-full">
                <Button 
                  className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  variant="outline"
                >
                  Create new user
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          <DashboardCard
            title="Active Catering Orders"
            linkText="View All Catering Orders"
            linkHref="/admin/catering-orders"
          >
            <RecentOrdersTable orders={activeOrders} />
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