import React from "react";
import { Suspense } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Calendar, Clock, Truck, MapPin, MessageSquare, PlusCircle, User } from "lucide-react";
import Link from "next/link";

// Mock data for UI demonstration - replace with actual data fetching
const mockRecentOrders = [
  {
    id: "1",
    orderNumber: "ORD-20230001",
    status: "COMPLETED",
    orderType: "catering",
    pickupDateTime: new Date(2023, 5, 15, 9, 0),
    arrivalDateTime: new Date(2023, 5, 15, 10, 30),
    orderTotal: 450.00,
  },
  {
    id: "2",
    orderNumber: "ORD-20230002",
    status: "ACTIVE",
    orderType: "on_demand",
    pickupDateTime: new Date(2023, 5, 20, 14, 0),
    arrivalDateTime: new Date(2023, 5, 20, 15, 30),
    orderTotal: 120.00,
  }
];

const UpcomingOrderCard = ({ order }: { order: any }) => {
  const statusColors = {
    ACTIVE: "bg-blue-100 text-blue-800",
    ASSIGNED: "bg-indigo-100 text-indigo-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
          {order.status}
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
        <span className="text-sm font-medium">${order.orderTotal.toFixed(2)}</span>
        <Link 
          href={`/client/orders/${order.id}`}
          className="text-primary text-sm font-medium hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const ClientDashboardContent = () => {
  const hasRecentOrders = mockRecentOrders.length > 0;

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
              <h4 className="text-2xl font-bold text-gray-900">3</h4>
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
              <h4 className="text-2xl font-bold text-gray-900">42</h4>
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
              <h4 className="text-2xl font-bold text-gray-900">5</h4>
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
              {mockRecentOrders.map(order => (
                <UpcomingOrderCard key={order.id} order={order} />
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

const ClientPage = () => {
  return (
    <>
      <Breadcrumb pageName="Client Dashboard" pageDescription="Manage your account" />
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
        <div className="max-w-full">
          <h2 className="text-title-md2 font-bold text-black dark:text-white mb-2">
            Welcome to your Client Dashboard
          </h2>
          <p className="text-body-color dark:text-gray-400 mb-8">
            Track orders, manage your deliveries, and update your profile information.
          </p>
          
          <Suspense fallback={<div className="text-center py-10">Loading dashboard...</div>}>
            <ClientDashboardContent />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ClientPage;
