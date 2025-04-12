import React, { Suspense } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Calendar, Clock, Truck, MapPin, MessageSquare, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CateringStatus, OnDemandStatus, Prisma } from "@prisma/client";

// Define types for our orders
type CombinedOrder = (
  | (Pick<Prisma.CateringRequestGetPayload<{}>, 'id' | 'orderNumber' | 'status' | 'pickupDateTime' | 'arrivalDateTime' | 'orderTotal'> & { orderType: 'catering' })
  | (Pick<Prisma.OnDemandGetPayload<{}>, 'id' | 'orderNumber' | 'status' | 'pickupDateTime' | 'arrivalDateTime' | 'orderTotal'> & { orderType: 'on_demand' })
);

interface DashboardStats {
  activeOrders: number;
  completedOrders: number;
  savedLocations: number;
}

interface ClientDashboardData {
  recentOrders: CombinedOrder[];
  stats: DashboardStats;
}

// Add this utility function at the top level
function convertToUTC(date: string, time: string): string {
  // Parse the local date and time
  const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
  const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
  
  // Create a date object in the local timezone
  const localDate = new Date(year, month - 1, day, hours, minutes);
  
  // Convert to UTC
  const utcYear = localDate.getUTCFullYear();
  const utcMonth = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const utcDay = localDate.getUTCDate().toString().padStart(2, '0');
  const utcHours = localDate.getUTCHours().toString().padStart(2, '0');
  const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, '0');
  
  // Return ISO string
  return `${utcYear}-${utcMonth}-${utcDay}T${utcHours}:${utcMinutes}:00.000Z`;
}

// Update the formatDateTime function in getClientDashboardData
const formatDateTime = (date: string, time: string | null | undefined) => {
  if (!date || !time) return null;
  
  // Validate time format
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    throw new Error(`Invalid time format: ${time}. Please use HH:MM format (24-hour).`);
  }

  try {
    // Convert the local date/time to UTC
    return convertToUTC(date, time);
  } catch (error) {
    console.error('Date/time parsing error:', { date, time, error });
    throw new Error(`Invalid date/time format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Data fetching function
async function getClientDashboardData(userId: string): Promise<ClientDashboardData> {
  // Fetch recent catering orders
  const recentCateringOrders = await prisma.cateringRequest.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      pickupDateTime: true,
      arrivalDateTime: true,
      orderTotal: true,
    },
  });

  // Fetch recent on-demand orders
  const recentOnDemandOrders = await prisma.onDemand.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      pickupDateTime: true,
      arrivalDateTime: true,
      orderTotal: true,
    },
  });

  // Combine and sort orders
  const combinedOrders: CombinedOrder[] = [
    ...recentCateringOrders.map(order => ({ ...order, orderType: 'catering' as const })),
    ...recentOnDemandOrders.map(order => ({ ...order, orderType: 'on_demand' as const })),
  ]
    .sort((a, b) => (b.pickupDateTime?.getTime() ?? 0) - (a.pickupDateTime?.getTime() ?? 0))
    .slice(0, 3);

  // Get stats
  const [activeCateringCount, activeOnDemandCount, completedCateringCount, completedOnDemandCount, savedLocationsCount] =
    await Promise.all([
      prisma.cateringRequest.count({
        where: {
          userId,
          status: { in: [CateringStatus.ACTIVE, CateringStatus.ASSIGNED] },
          deletedAt: null,
        },
      }),
      prisma.onDemand.count({
        where: {
          userId,
          status: { in: [OnDemandStatus.ACTIVE, OnDemandStatus.ASSIGNED] },
          deletedAt: null,
        },
      }),
      prisma.cateringRequest.count({
        where: {
          userId,
          status: CateringStatus.COMPLETED,
          deletedAt: null,
        },
      }),
      prisma.onDemand.count({
        where: {
          userId,
          status: OnDemandStatus.COMPLETED,
          deletedAt: null,
        },
      }),
      prisma.userAddress.count({
        where: { userId },
      }),
    ]);

  return {
    recentOrders: combinedOrders,
    stats: {
      activeOrders: activeCateringCount + activeOnDemandCount,
      completedOrders: completedCateringCount + completedOnDemandCount,
      savedLocations: savedLocationsCount,
    },
  };
}

const UpcomingOrderCard = ({ order }: { order: CombinedOrder }) => {
  const statusColors: Record<CateringStatus | OnDemandStatus, string> = {
    ACTIVE: "bg-blue-100 text-blue-800",
    ASSIGNED: "bg-indigo-100 text-indigo-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    
    // Create a date object and convert to local time
    const localDate = new Date(date);
    return localDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'America/Los_Angeles'
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "N/A";
    
    // Create a date object and convert to local time
    const localDate = new Date(date);
    return localDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Los_Angeles',
      hour12: true
    });
  };

  const formatCurrency = (amount: Prisma.Decimal | null) => {
    if (!amount) return "$0.00";
    return `$${Number(amount).toFixed(2)}`;
  };

  // Determine the correct route based on order type
  const orderDetailsLink = order.orderType === 'catering' 
    ? `/client/orders/${order.id}`  // Update this path based on your routing structure
    : `/client/orders/${order.id}`; // Update this path based on your routing structure

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {order.status.toLowerCase().replace('_', ' ')}
        </span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar className="h-4 w-4 mr-1.5" />
        <span>{formatDate(order.pickupDateTime)}</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Clock className="h-4 w-4 mr-1.5" />
        <span>Pickup: {formatTime(order.pickupDateTime)}</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Clock className="h-4 w-4 mr-1.5" />
        <span>Arrival: {formatTime(order.arrivalDateTime)}</span>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-sm font-medium">{formatCurrency(order.orderTotal)}</span>
        <Link 
          href={orderDetailsLink}
          className="text-primary text-sm font-medium hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const ClientDashboardContent = ({ data }: { data: ClientDashboardData }) => {
  const hasRecentOrders = data.recentOrders.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Stats Section */}
      <div className="md:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-primary-lighter p-3 rounded-lg mr-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Orders</p>
              <h4 className="text-2xl font-bold text-gray-900">{data.stats.activeOrders}</h4>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-50 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <h4 className="text-2xl font-bold text-gray-900">{data.stats.completedOrders}</h4>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg mr-4">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Saved Locations</p>
              <h4 className="text-2xl font-bold text-gray-900">{data.stats.savedLocations}</h4>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders Section */}
      <div className="md:col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link 
              href="/client/orders"
              className="text-sm text-primary font-medium hover:underline"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-5">
          {hasRecentOrders ? (
            <div className="space-y-4">
              {data.recentOrders.map(order => (
                <UpcomingOrderCard key={`${order.orderType}-${order.id}`} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
              <Link 
                href="/client/orders/new" 
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
              >
                <PlusCircle className="h-5 w-5 mr-1.5" />
                Place Your First Order
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions Section */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        
        <div className="p-5">
          <div className="space-y-4">
            <Link 
              href="/client/orders/new" 
              className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="bg-primary-lighter p-2 rounded-md mr-3">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">New Order</h4>
                <p className="text-xs text-gray-500">Create a new delivery request</p>
              </div>
            </Link>
            
            <Link 
              href="/client/addresses" 
              className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-50 p-2 rounded-md mr-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage Addresses</h4>
                <p className="text-xs text-gray-500">Add or edit your locations</p>
              </div>
            </Link>
            
            <Link 
              href="/client/profile" 
              className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="bg-purple-50 p-2 rounded-md mr-3">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Update Profile</h4>
                <p className="text-xs text-gray-500">Manage your account details</p>
              </div>
            </Link>
            
            <Link 
              href="/contact" 
              className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="bg-orange-50 p-2 rounded-md mr-3">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Contact Us</h4>
                <p className="text-xs text-gray-500">Get in touch with our team</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientPage = async () => {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    redirect('/signin');
  }

  // Fetch dashboard data
  const dashboardData = await getClientDashboardData(user.id);

  return (
    <>
      <Breadcrumb pageName="Client Dashboard" pageDescription="Manage your account" />
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
        <div className="max-w-full">
          <h2 className="text-title-md2 font-bold text-black dark:text-white mb-2">
            Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h2>
          <p className="text-body-color dark:text-gray-400 mb-8">
            Track orders, manage your deliveries, and update your profile information.
          </p>
          
          <Suspense fallback={<div className="text-center py-10">Loading dashboard...</div>}>
            <ClientDashboardContent data={dashboardData} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ClientPage;
