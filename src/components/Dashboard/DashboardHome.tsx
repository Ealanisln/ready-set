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
  Bell,
  Briefcase,
  LayoutDashboard,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/types/user";
import { CateringRequest, OrderStatus, isCateringRequest, isOnDemand } from "@/types/order";
import { useDashboardMetrics } from "@/components/Dashboard/DashboardMetrics";
import { LoadingDashboard } from "../ui/loading";
import { ApplicationStatus, JobApplication } from "@/types/job-application";
import { useUser } from "@/contexts/UserContext";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Add interface for Job Applications API response
interface JobApplicationsApiResponse {
  applications: JobApplication[];
  totalCount: number;
  totalPages: number;
}

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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={`rounded-full p-2 ${accent.replace('bg-', 'bg-opacity-15 text-')}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-gray-50">
            <span className={`mr-1 ${trendConfig[trend].color}`}>{change}</span>
            {trendConfig[trend].icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-0">
        <div className="space-y-1">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <div className="mt-4 h-1">
          <div className={`h-full w-2/3 rounded-full ${accent}`}></div>
        </div>
      </CardContent>
    </Card>
  );
};

// Action Card Component
const ActionCard: React.FC = () => (
  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">Quick Actions</CardTitle>
      <CardDescription className="text-xs text-gray-500">
        Common operations you might need
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="space-y-3">
        <Link href="/catering-request" className="block w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 flex items-center justify-center gap-2">
            Create new order
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/admin/users/new" className="block w-full">
          <Button 
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200"
            variant="outline"
          >
            Create new user
          </Button>
        </Link>
      </div>
    </CardContent>
    <CardFooter className="pt-0 pb-4">
      <div className="w-full pt-3 border-t border-gray-100">
        <Link href="/admin/dashboard/settings" className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-end">
          Dashboard settings
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </CardFooter>
  </Card>
);

// Application Status Badge Component
const ApplicationStatusBadge: React.FC<{status: ApplicationStatus}> = ({ status }) => {
  const config: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
    [ApplicationStatus.PENDING]: { 
      bg: "bg-amber-100", 
      text: "text-amber-700",
      icon: <Clock className="h-3 w-3 mr-1" />
    },
    [ApplicationStatus.APPROVED]: { 
      bg: "bg-green-100", 
      text: "text-green-700", 
      icon: <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
    [ApplicationStatus.REJECTED]: { 
      bg: "bg-red-100", 
      text: "text-red-700", 
      icon: <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
    [ApplicationStatus.INTERVIEWING]: { 
      bg: "bg-indigo-100", 
      text: "text-indigo-700",
      icon: <Users className="h-3 w-3 mr-1" />
    }
  };

  const style = config[status] || { bg: "bg-gray-100", text: "text-gray-700", icon: null };
  
  const label = {
    [ApplicationStatus.PENDING]: "Pending",
    [ApplicationStatus.APPROVED]: "Approved",
    [ApplicationStatus.REJECTED]: "Rejected",
    [ApplicationStatus.INTERVIEWING]: "Interviewing"
  }[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.icon}
      {label}
    </span>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{status: string}> = ({ status }) => {
  const config: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
    active: { 
      bg: "bg-blue-100", 
      text: "text-blue-700", 
      icon: <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg> 
    },
    pending: { 
      bg: "bg-amber-100", 
      text: "text-amber-700", 
      icon: <Clock className="h-3 w-3 mr-1" /> 
    },
    confirmed: { 
      bg: "bg-indigo-100", 
      text: "text-indigo-700", 
      icon: <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg> 
    },
    in_progress: { 
      bg: "bg-purple-100", 
      text: "text-purple-700", 
      icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" /> 
    },
    completed: { 
      bg: "bg-green-100", 
      text: "text-green-700", 
      icon: <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg> 
    },
    cancelled: { 
      bg: "bg-red-100", 
      text: "text-red-700", 
      icon: <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg> 
    }
  };

  const style = config[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700", icon: null };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.icon}
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

// User Type Badge Component
const UserTypeBadge: React.FC<{type: string}> = ({ type }) => {
  const config: Record<string, { bg: string, text: string }> = {
    admin: { bg: "bg-indigo-100", text: "text-indigo-700" },
    super_admin: { bg: "bg-purple-100", text: "text-purple-700" },
    vendor: { bg: "bg-blue-100", text: "text-blue-700" },
    client: { bg: "bg-green-100", text: "text-green-700" },
    driver: { bg: "bg-amber-100", text: "text-amber-700" },
    helpdesk: { bg: "bg-teal-100", text: "text-teal-700" }
  };

  const style = config[type.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
    </span>
  );
};

// New component for Job Applications
const ModernJobApplicationsTable: React.FC<{applications: JobApplication[]}> = ({ applications }) => {
  // Format date for display
  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  return (
    <div className="overflow-hidden">
      {applications.length > 0 ? (
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50/80">
            <div className="grid grid-cols-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div>Applicant</div>
              <div>Position</div>
              <div>Status</div>
              <div>Applied</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="grid grid-cols-4 px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150">
                <div className="text-sm font-medium">
                  <Link href={`/admin/job-applications?id=${app.id}`} className="text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                    {app.firstName} {app.lastName}
                  </Link>
                </div>
                <div className="text-sm text-gray-600">
                  {app.position}
                </div>
                <div><ApplicationStatusBadge status={app.status} /></div>
                <div className="text-sm text-gray-600">
                  {formatDate(app.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-gray-50/50 rounded-lg">
          <Briefcase className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-sm">No job applications at this moment</p>
          <Button variant="ghost" size="sm" className="mt-2 text-xs">
            Post a new job opening
          </Button>
        </div>
      )}
    </div>
  );
};

// Recent Orders Table Component
const ModernOrdersTable: React.FC<{orders: CateringRequest[]}> = ({ orders }) => (
  <div className="overflow-hidden">
    {orders.length > 0 ? (
      <div className="min-w-full divide-y divide-gray-200">
        <div className="bg-gray-50/80">
          <div className="grid grid-cols-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Order</div>
            <div>Type</div>
            <div>Status</div>
            <div>Total</div>
          </div>
        </div>
        <div className="bg-white divide-y divide-gray-100">
          {orders.map((order) => (
            <div key={order.id} className="grid grid-cols-4 px-6 py-4 hover:bg-gray-50/50 transition-colors duration-150">
              <div className="text-sm font-medium">
                <Link href={`/admin/catering-orders/${order.orderNumber}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                  #{order.orderNumber}
                </Link>
              </div>
              <div className="text-sm text-gray-600">
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
      <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-gray-50/50 rounded-lg">
        <ClipboardList className="h-10 w-10 text-gray-300 mb-2" />
        <p className="text-sm">No active orders at this moment</p>
        <Link href="/catering-request">
          <Button variant="ghost" size="sm" className="mt-2 text-xs">
            Create new order
          </Button>
        </Link>
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
        <div className="hidden md:grid md:grid-cols-3 bg-gray-50/80 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div>Name</div>
          <div>Email</div>
          <div>Type</div>
        </div>
        {/* User Rows */}
        <div className="bg-white divide-y divide-gray-100">
          {users.map((user) => (
            // Stack vertically on small screens, grid on medium+
            <div key={user.id} className="px-4 py-4 md:px-6 md:grid md:grid-cols-3 md:gap-4 hover:bg-gray-50/50 transition-colors duration-150 items-center">
              {/* Name */}
              <div className="flex justify-between items-center md:block">
                 <span className="text-xs font-medium text-gray-500 uppercase md:hidden mr-2">Name:</span>
                 <div className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate">
                   <Link href={`/admin/users/${user.id}`}>
                     {user.name || user.contactName || "Unnamed User"}
                   </Link>
                 </div>
              </div>
              {/* Email */}
              <div className="mt-2 md:mt-0 flex justify-between items-center md:block">
                 <span className="text-xs font-medium text-gray-500 uppercase md:hidden mr-2">Email:</span>
                 <div className="text-sm text-gray-600 truncate">{user.email}</div>
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
      <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-gray-50/50 rounded-lg">
        <Users className="h-10 w-10 text-gray-300 mb-2" />
        <p className="text-sm">No users found</p>
        <Link href="/admin/users/new">
          <Button variant="ghost" size="sm" className="mt-2 text-xs">
            Create new user
          </Button>
        </Link>
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
  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col">
    <CardHeader className="pb-3 space-y-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="h-5 w-5 text-gray-400" />}
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
        <Link 
          href={linkHref} 
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center group"
        >
          {linkText}
          <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </CardHeader>
    <CardContent className="p-0 flex-grow">
      {children}
    </CardContent>
  </Card>
);

// Redesigned DashboardHome Component
export function ModernDashboardHome() {
  const { 
    user, 
    isLoading: userLoading, 
    error: userError 
  } = useUser();
  
  const [recentOrders, setRecentOrders] = useState<CateringRequest[]>([]);
  const [activeOrders, setActiveOrders] = useState<CateringRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [pendingApplications, setPendingApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
  } = useDashboardMetrics();

  useEffect(() => {
    if (userLoading || !user) {
      if (!userLoading && !user) {
        setLoading(false); 
      }
      return; 
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled([
          fetch("/api/orders/catering-orders?recentOnly=true"),
          fetch("/api/users"),
          fetch("/api/admin/job-applications")
        ]);

        const ordersResult = results[0];
        if (ordersResult.status === 'fulfilled') {
          if (!ordersResult.value.ok) {
            const errorText = await ordersResult.value.text();
            throw new Error(`Orders API failed: ${ordersResult.value.status} - ${errorText}`);
          }
          const ordersData = await ordersResult.value.json() as OrdersApiResponse;
          console.log('Orders data:', ordersData.orders);
          setRecentOrders(ordersData.orders || []);
          const activeOrdersList = (ordersData.orders || []).filter((order: CateringRequest) => 
            [OrderStatus.ACTIVE, OrderStatus.ASSIGNED].includes(order.status)
          );
          setActiveOrders(activeOrdersList);
        } else {
          console.error("Failed to fetch orders:", ordersResult.reason);
          throw new Error("Failed to fetch orders data.");
        }

        const usersResult = results[1];
        if (usersResult.status === 'fulfilled') {
          if (!usersResult.value.ok) {
            const errorText = await usersResult.value.text();
            throw new Error(`Users API failed: ${usersResult.value.status} - ${errorText}`);
          }
          const usersData = await usersResult.value.json() as UsersApiResponse;
          setUsers(usersData.users || []);
        } else {
           console.error("Failed to fetch users:", usersResult.reason);
          throw new Error("Failed to fetch users data.");
        }

        const applicationsResult = results[2];
        if (applicationsResult.status === 'fulfilled') {
          if (!applicationsResult.value.ok) {
            const errorText = await applicationsResult.value.text();
            throw new Error(`Applications API failed: ${applicationsResult.value.status} - ${errorText}`);
          }
          const applicationsData = await applicationsResult.value.json() as JobApplicationsApiResponse;
          console.log('Applications data:', applicationsData.applications);
          setRecentApplications(applicationsData.applications || []);
          const pendingAppsList = (applicationsData.applications || []).filter(
            (app) => app.status === ApplicationStatus.PENDING
          );
          setPendingApplications(pendingAppsList);
        } else {
          console.error("Failed to fetch applications:", applicationsResult.reason);
          throw new Error("Failed to fetch applications data.");
        }

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred fetching dashboard data');
      } finally {
         setLoading(false);
      }
    };

    fetchData();
  }, [userLoading, user]);

  const combinedLoading = userLoading || loading || metricsLoading;
  const combinedError = userError || error || metricsError;

  if (combinedLoading) {
    return <LoadingDashboard />;
  }

  if (combinedError) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50">
        <div className="rounded-lg bg-white p-8 shadow-lg max-w-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-center text-gray-900">Error Loading Dashboard</h3>
          <p className="text-sm text-center text-red-600">{combinedError}</p> 
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

  const totalOrdersCount = Array.isArray(recentOrders) ? recentOrders.length : 0;
  const activeOrdersPercentage = ((activeOrders.length / (totalOrdersCount || 1)) * 100).toFixed(1);
  
  const totalApplicationsCount = Array.isArray(recentApplications) ? recentApplications.length : 0;
  const pendingApplicationsPercentage = ((pendingApplications.length / (totalApplicationsCount || 1)) * 100).toFixed(1);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <LayoutDashboard className="h-6 w-6 text-primary mr-2 hidden sm:block" />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative rounded-md shadow-sm hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
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

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Overview</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <ModernMetricCard
              title="Active Orders"
              value={activeOrders.length}
              icon={ClipboardList}
              change={`${activeOrdersPercentage}% of total`}
              trend={Number(activeOrdersPercentage) > 50 ? "up" : "neutral"}
              accent="bg-blue-500"
            />
            <ModernMetricCard
              title="Pending Applications"
              value={pendingApplications.length}
              icon={Briefcase}
              change={`${pendingApplicationsPercentage}% of total`}
              trend={Number(pendingApplicationsPercentage) > 30 ? "up" : "neutral"}
              accent="bg-indigo-500"
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

        <div className="grid gap-6 md:grid-cols-2">
          <ModernDashboardCard
            title="Active Catering Orders"
            linkText="View All Orders"
            linkHref="/admin/catering-orders"
            icon={Calendar}
          >
            <ModernOrdersTable orders={activeOrders} />
          </ModernDashboardCard>
          
          <ModernDashboardCard
            title="Recent Job Applications"
            linkText="View All Applications"
            linkHref="/admin/job-applications"
            icon={Briefcase}
          >
            <ModernJobApplicationsTable applications={recentApplications.slice(0, 5)} />
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