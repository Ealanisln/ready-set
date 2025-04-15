// src/components/Dashboard/DashboardHome.tsx

"use client";

import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Users, 
  Clock, 
  TrendingUp, 
  BarChart4, 
  Calendar, 
  ChevronRight,
  Menu,
  Search,
  Bell 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/types/user";
import { CateringRequest, OrderStatus, isCateringRequest, isOnDemand } from "@/types/order";
import { useDashboardMetrics } from "@/components/Dashboard/DashboardMetrics";
import { LoadingDashboard } from "../ui/loading";

// Add interface for Orders API response
interface OrdersApiResponse {
  orders: CateringRequest[];
  totalPages: number; // Adjust if the API response structure is different
}

// Interface for API responses
interface UsersApiResponse {
  users: User[];
  totalPages: number;
}

// Modern Metric Card Component
const ModernMetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  trend?: "up" | "down" | "neutral";
  accent?: string;
}> = ({ title, value, icon: Icon, change, trend = "neutral", accent = "bg-blue-500" }) => {
  // Determine trend color and icon
  const trendConfig = {
    up: { color: "text-green-500", icon: <TrendingUp className="h-3 w-3" /> },
    down: { color: "text-red-500", icon: <TrendingUp className="h-3 w-3 transform rotate-180" /> },
    neutral: { color: "text-gray-500", icon: null }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className={`h-1 ${accent}`}></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-full p-3 ${accent.replace('bg-', 'bg-opacity-10 text-')}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center space-x-1">
            <p className={`text-xs ${trendConfig[trend].color}`}>{change}</p>
            {trendConfig[trend].icon}
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Action Card Component
const ActionCard: React.FC = () => (
  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
    <div className="h-1 bg-yellow-400"></div>
    <CardContent className="p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link href="/catering-request" className="block w-full">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white transition-all duration-200">
            Create new order
          </Button>
        </Link>
        <Link href="/admin/users/new" className="block w-full">
          <Button 
            className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50 transition-all duration-200"
            variant="outline"
          >
            Create new user
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

// Status Badge Component
const StatusBadge: React.FC<{status: string}> = ({ status }) => {
  const config: Record<string, { bg: string, text: string }> = {
    active: { bg: "bg-purple-100", text: "text-purple-700" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
    confirmed: { bg: "bg-blue-100", text: "text-blue-700" },
    in_progress: { bg: "bg-indigo-100", text: "text-indigo-700" },
    completed: { bg: "bg-green-100", text: "text-green-700" },
    cancelled: { bg: "bg-red-100", text: "text-red-700" }
  };

  const style = config[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// User Type Badge Component
const UserTypeBadge: React.FC<{type: string}> = ({ type }) => {
  const config: Record<string, { bg: string, text: string }> = {
    admin: { bg: "bg-purple-100", text: "text-purple-700" },
    super_admin: { bg: "bg-indigo-100", text: "text-indigo-700" },
    vendor: { bg: "bg-blue-100", text: "text-blue-700" },
    client: { bg: "bg-green-100", text: "text-green-700" },
    driver: { bg: "bg-yellow-100", text: "text-yellow-700" },
    helpdesk: { bg: "bg-orange-100", text: "text-orange-700" }
  };

  const style = config[type.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

// Recent Orders Table Component
const ModernOrdersTable: React.FC<{orders: CateringRequest[]}> = ({ orders }) => (
  <div className="overflow-hidden">
    {orders.length > 0 ? (
      <div className="min-w-full divide-y divide-gray-200">
        <div className="bg-gray-50">
          <div className="grid grid-cols-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Order</div>
            <div>Type</div>
            <div>Status</div>
            <div>Total</div>
          </div>
        </div>
        <div className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="grid grid-cols-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                <Link href={`/admin/catering-orders/${order.orderNumber}`}>
                  {order.orderNumber}
                </Link>
              </div>
              <div className="text-sm text-gray-500">
                {isCateringRequest(order) ? "Catering" : isOnDemand(order) ? "On Demand" : "Catering"}
              </div>
              <div><StatusBadge status={order.status} /></div>
              <div className="text-sm font-medium text-gray-900">
                ${order.orderTotal ? 
                  (typeof order.orderTotal === 'number' 
                    ? order.orderTotal.toFixed(2) 
                    : parseFloat(order.orderTotal).toFixed(2))
                  : "0.00"}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <ClipboardList className="h-10 w-10 text-gray-300 mb-2" />
        <p>No active orders at this moment</p>
      </div>
    )}
  </div>
);

// Recent Users Table Component
const ModernUsersTable: React.FC<{users: User[]}> = ({ users }) => (
  <div className="overflow-hidden">
    {users.length > 0 ? (
      <div className="min-w-full divide-y divide-gray-200">
        {/* Header - hidden on small screens, grid on medium+ */}
        <div className="hidden md:grid md:grid-cols-3 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div>Name</div>
          <div>Email</div>
          <div>Type</div>
        </div>
        {/* User Rows */}
        <div className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            // Stack vertically on small screens, grid on medium+
            <div key={user.id} className="px-4 py-4 md:px-6 md:grid md:grid-cols-3 md:gap-4 hover:bg-gray-50 transition-colors duration-150 items-center">
              {/* Name */}
              <div className="flex justify-between items-center md:block">
                 <span className="text-xs font-medium text-gray-500 uppercase md:hidden mr-2">Name:</span>
                 <div className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate">
                   <Link href={`/admin/users/${user.id}`}>
                     {user.name || user.contactName || "Unnamed User"}
                   </Link>
                 </div>
              </div>
              {/* Email */}
              <div className="mt-2 md:mt-0 flex justify-between items-center md:block">
                 <span className="text-xs font-medium text-gray-500 uppercase md:hidden mr-2">Email:</span>
                 <div className="text-sm text-gray-500 truncate">{user.email}</div>
              </div>
              {/* Type */}
              <div className="mt-2 md:mt-0 flex justify-between items-center md:block">
                 <span className="text-xs font-medium text-gray-500 uppercase md:hidden mr-2">Type:</span>
                 <div><UserTypeBadge type={user.type} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <Users className="h-10 w-10 text-gray-300 mb-2" />
        <p>No users found</p>
      </div>
    )}
  </div>
);

// Modern Dashboard Card Component
const ModernDashboardCard: React.FC<{
  title: string;
  children: React.ReactNode;
  linkText: string;
  linkHref: string;
  icon?: React.ElementType;
}> = ({ title, children, linkText, linkHref, icon: Icon }) => (
  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        <h3 className="font-medium">{title}</h3>
      </div>
      <Link 
        href={linkHref} 
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center group"
      >
        {linkText}
        <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
    <CardContent className="p-0">
      {children}
    </CardContent>
  </Card>
);

// Redesigned DashboardHome Component
export function ModernDashboardHome() {
  const [recentOrders, setRecentOrders] = useState<CateringRequest[]>([]);
  const [activeOrders, setActiveOrders] = useState<CateringRequest[]>([]);
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
        const ordersResponse = await fetch("/api/orders/catering-orders?recentOnly=true");
        const usersResponse = await fetch("/api/users");
        
        if (!ordersResponse.ok) {
          const errorText = await ordersResponse.text();
          throw new Error(`Orders API failed: ${ordersResponse.status} - ${errorText}`);
        }
        
        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          throw new Error(`Users API failed: ${usersResponse.status} - ${errorText}`);
        }
        
        const ordersData = await ordersResponse.json() as OrdersApiResponse;
        const usersData = await usersResponse.json() as UsersApiResponse;
        
        console.log('Orders data:', ordersData.orders);
        
        // Fix: Extract orders array from the response
        setRecentOrders(ordersData.orders || []);
        
        const activeOrdersList = (ordersData.orders || []).filter((order: CateringRequest) => 
          [OrderStatus.ACTIVE, OrderStatus.ASSIGNED].includes(order.status)
        );
        setActiveOrders(activeOrdersList);
        
        // Use the users array from the response
        setUsers(usersData.users || []);
        setLoading(false);
        
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Modern loading spinner
  if (loading || metricsLoading) {
    return <LoadingDashboard />;
  }

  // Modern error display
  if (error || metricsError) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50">
        <div className="rounded-lg bg-white p-8 shadow-lg max-w-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-center text-gray-900">Error Loading Dashboard</h3>
          <p className="text-sm text-center text-red-600">{error || metricsError}</p>
          <div className="mt-6 text-center">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentage changes for metrics
  const totalOrdersCount = Array.isArray(recentOrders) ? recentOrders.length : 0;
  const activeOrdersPercentage = ((activeOrders.length / (totalOrdersCount || 1)) * 100).toFixed(1);
  
  // Modern dashboard layout
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      {/* Top navigation bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative rounded-md shadow-sm hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Search..."
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-6 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Overview</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ModernMetricCard
              title="Active Orders"
              value={activeOrders.length}
              icon={ClipboardList}
              change={`${activeOrdersPercentage}% of total`}
              trend={Number(activeOrdersPercentage) > 50 ? "up" : "neutral"}
              accent="bg-blue-500"
            />
            <ModernMetricCard
              title="Delivery Requests"
              value={metrics.deliveriesRequests}
              icon={Clock}
              change="+180.1% from last month"
              trend="up"
              accent="bg-purple-500"
            />
            <ModernMetricCard
              title="Total Vendors"
              value={metrics.totalVendors}
              icon={BarChart4}
              change="+180.1% from last month"
              trend="up"
              accent="bg-green-500"
            />
            <ActionCard />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <ModernDashboardCard
            title="Active Catering Orders"
            linkText="View All Orders"
            linkHref="/admin/catering-orders"
            icon={Calendar}
          >
            <ModernOrdersTable orders={activeOrders} />
          </ModernDashboardCard>
          
          <ModernDashboardCard
            title="Recent Users"
            linkText="View All Users"
            linkHref="/admin/users"
            icon={Users}
          >
            <ModernUsersTable users={users.slice(0, 5)} />
          </ModernDashboardCard>
        </div>
      </main>
    </div>
  );
}

// Export the component as default
export default ModernDashboardHome;