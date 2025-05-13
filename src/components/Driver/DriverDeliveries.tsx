"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileResponse } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Loader2, 
  MapPin, 
  Package, 
  Truck, 
  Calendar, 
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
  User
} from "lucide-react";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserStatus } from "@/types/user";

// Log UserStatus values for debugging
console.log("UserStatus enum values:", {
  ACTIVE: UserStatus.ACTIVE,
  PENDING: UserStatus.PENDING,
  DELETED: UserStatus.DELETED
});

interface Delivery {
  id: string;
  order_number: string;
  delivery_type: "catering" | "on_demand";
  status: string;
  driverStatus?: string;
  pickupDateTime: string;
  arrivalDateTime: string;
  completeDateTime?: string;
  order_total: string | number;
  client_attention: string;
  address: {
    street1: string | null;
    street2?: string | null;
    city: string | null;
    state: string | null;
    zip?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  delivery_address?: {
    street1: string | null;
    street2?: string | null;
    city: string | null;
    state: string | null;
    zip?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  specialNotes?: string | null;
  pickupNotes?: string | null;
  createdAt: string;
  // Additional fields from database
  headcount?: number | null; // For catering
  needHost?: string | null; // For catering
  hoursNeeded?: number | null;
  vehicleType?: string | null; // For on_demand
  itemDelivered?: string | null; // For on_demand
  dimensions?: {
    length?: number | null;
    width?: number | null;
    height?: number | null;
    weight?: number | null;
  }; // For on_demand
  user?: {
    name?: string | null;
    email: string;
  };
}

interface UserProfile extends ProfileResponse {
  // Additional fields can be added here if needed
  status?: UserStatus;
}

type DeliveryStatus = 'all' | 'active' | 'completed' | 'assigned';

const DriverDeliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [activeTab, setActiveTab] = useState<"upcoming" | "today" | "completed">("today");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus>('all');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsProfileLoading(true);
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const profileData: UserProfile = await response.json();
        console.log("User profile data:", profileData);
        console.log("User status:", profileData.status);
        console.log("Status type:", typeof profileData.status);
        console.log("Is status pending:", profileData.status === UserStatus.PENDING);
        console.log("Is status active:", profileData.status === UserStatus.ACTIVE);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setIsLoading(true);
      const apiUrl = `/api/driver-deliveries?page=${page}&limit=${limit}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch deliveries");
        }
        const data: Delivery[] = await response.json();
        setDeliveries(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, [page, limit]);

  // Filter deliveries based on activeTab and statusFilter
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const filtered = deliveries.filter(delivery => {
      const pickupDate = new Date(delivery.pickupDateTime);
      
      // First filter by tab
      if (activeTab === "today") {
        if (pickupDate < today || pickupDate >= tomorrow) return false;
      } else if (activeTab === "upcoming") {
        if (pickupDate < tomorrow) return false;
      } else if (activeTab === "completed") {
        if (!delivery.completeDateTime) return false;
      }
      
      // Then filter by status if not "all"
      if (statusFilter !== 'all' && delivery.status !== statusFilter) {
        return false;
      }
      
      return true;
    });
    
    setFilteredDeliveries(filtered);
  }, [deliveries, activeTab, statusFilter]);

  // Get time of day greeting
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Format the user's first name
  const getFirstName = (): string => {
    if (!userProfile?.name) return "";
    return userProfile.name.split(" ")[0];
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const getDeliveryTypeBadge = (type: "catering" | "on_demand") => {
    switch (type) {
      case "catering":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <ClipboardList className="mr-1 h-3 w-3" />
            Catering
          </Badge>
        );
      case "on_demand":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <Package className="mr-1 h-3 w-3" />
            On Demand
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, driverStatus?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Active
          </Badge>
        );
      case "assigned":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Assigned
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Format address for display
  const formatAddress = (address: Delivery['address']) => {
    if (!address) return 'N/A';
    return `${address.street1}${address.street2 ? `, ${address.street2}` : ''}, ${address.city}, ${address.state}${address.zip ? ` ${address.zip}` : ''}`;
  };

  // Format date and time for display
  const formatDateTime = (dateTimeStr: string) => {
    const dateTime = new Date(dateTimeStr);
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date: formattedDate, time: formattedTime, dateTime };
  };

  // Calculate time until pickup
  const getTimeUntil = (dateTimeStr: string) => {
    const now = new Date();
    const pickupTime = new Date(dateTimeStr);
    const diffMs = pickupTime.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Overdue';
    
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    
    if (diffHours < 1) {
      return `${diffMin} min`;
    } else if (diffHours < 24) {
      return `${diffHours} hr ${diffMin % 60} min`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  const getAdditionalDeliveryInfo = (delivery: Delivery) => {
    const info = [];
    
    if (delivery.delivery_type === "catering") {
      if (delivery.headcount) info.push(`Headcount: ${delivery.headcount}`);
      if (delivery.needHost) info.push(`Need Host: ${delivery.needHost}`);
    } else if (delivery.delivery_type === "on_demand") {
      if (delivery.vehicleType) info.push(`Vehicle: ${delivery.vehicleType}`);
      if (delivery.itemDelivered) info.push(`Item: ${delivery.itemDelivered}`);
      if (delivery.dimensions && Object.values(delivery.dimensions).some(Boolean)) {
        const { length, width, height, weight } = delivery.dimensions;
        let dimensionStr = 'Dimensions: ';
        if (length && width && height) {
          dimensionStr += `${length}×${width}×${height}`;
        }
        if (weight) {
          dimensionStr += ` / Weight: ${weight}`;
        }
        info.push(dimensionStr);
      }
    }
    
    if (delivery.hoursNeeded) info.push(`Hours: ${delivery.hoursNeeded}`);
    
    return info;
  };

  if (error) {
    return (
      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Count deliveries by status
  const todayCount = deliveries.filter(d => {
    const pickupDate = new Date(d.pickupDateTime);
    const today = new Date();
    return pickupDate.toDateString() === today.toDateString();
  }).length;

  const upcomingCount = deliveries.filter(d => {
    const pickupDate = new Date(d.pickupDateTime);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return pickupDate >= tomorrow;
  }).length;

  const completedCount = deliveries.filter(d => !!d.completeDateTime).length;

  return (
    <div className="container px-4 mx-auto">
      {/* User Welcome */}
      <div className="mb-6">
        <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                {userProfile?.image ? (
                  <img 
                    src={userProfile.image} 
                    alt={userProfile.name || "Driver"} 
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {getGreeting()}, {isProfileLoading ? (
                    <span className="animate-pulse">Driver</span>
                  ) : (
                    getFirstName() || "Driver"
                  )}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Here's your delivery overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Status Alert */}
      {!isProfileLoading && userProfile?.status && userProfile.status.toString().toLowerCase() !== UserStatus.ACTIVE && (
        <div className="mb-6">
          <Alert 
            variant={userProfile.status.toString().toLowerCase() === UserStatus.PENDING ? "default" : "destructive"}
            className={userProfile.status.toString().toLowerCase() === UserStatus.PENDING 
              ? "border-amber-500/50 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-300 [&>svg]:text-amber-800 dark:[&>svg]:text-amber-300" 
              : undefined}
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {userProfile.status.toString().toLowerCase() === UserStatus.PENDING 
                ? "Account Pending Approval" 
                : userProfile.status.toString().toLowerCase() === UserStatus.DELETED 
                  ? "Account Deactivated" 
                  : "Account Status Issue"}
            </AlertTitle>
            <AlertDescription>
              {userProfile.status.toString().toLowerCase() === UserStatus.PENDING 
                ? "Our team is currently reviewing your submitted documents and information. During this verification process, you may have limited access to certain features. You'll be notified once your account is approved." 
                : userProfile.status.toString().toLowerCase() === UserStatus.DELETED 
                  ? "Your account has been deactivated by the administrator. All functionality has been disabled. Please contact support for assistance if you believe this is an error." 
                  : "There's an issue with your account status. Please contact support for assistance."}
            </AlertDescription>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => window.location.href = "mailto:apply@readysetllc.com"}
              >
                Contact Support
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* If account is deleted, show a disabled message and no other content */}
      {userProfile?.status && userProfile.status.toString().toLowerCase() === UserStatus.DELETED ? (
        <Card className="shadow-sm border-red-200">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Account Access Disabled</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Your account has been deactivated. You cannot access the driver dashboard or delivery features at this time.
            </p>
            <Button variant="outline" className="mt-2" disabled>
              Dashboard Unavailable
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-lg font-medium">Today's Deliveries</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 pt-0 px-6">
                <div className="flex items-center">
                  <Calendar className="h-7 w-7 text-blue-500 mr-3" />
                  <div className="text-3xl font-bold">{todayCount}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-lg font-medium">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 pt-0 px-6">
                <div className="flex items-center">
                  <Clock className="h-7 w-7 text-purple-500 mr-3" />
                  <div className="text-3xl font-bold">{upcomingCount}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-lg font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 pt-0 px-6">
                <div className="flex items-center">
                  <CheckCircle2 className="h-7 w-7 text-green-500 mr-3" />
                  <div className="text-3xl font-bold">{completedCount}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Card */}
          <Card className="shadow-sm">
            <CardHeader className="py-5 px-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl font-medium">Delivery Dashboard</CardTitle>
                  <CardDescription className="text-balance leading-relaxed mt-1">
                    Manage your assigned deliveries and track your schedule
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0 md:ml-auto">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as DeliveryStatus)}
                  >
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="today" value={activeTab} onValueChange={(value) => setActiveTab(value as "upcoming" | "today" | "completed")}>
                <TabsList className="w-full md:w-auto mb-5 grid grid-cols-3">
                  <TabsTrigger value="today" className="flex-1 md:flex-none py-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    Today
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="flex-1 md:flex-none py-2">
                    <Clock className="mr-2 h-4 w-4" />
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1 md:flex-none py-2">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Completed
                  </TabsTrigger>
                </TabsList>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
                  </div>
                ) : filteredDeliveries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Truck className="mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      No Deliveries Found
                    </h3>
                    <p className="max-w-md text-gray-500 dark:text-gray-400">
                      {activeTab === "today" 
                        ? "You don't have any deliveries scheduled for today." 
                        : activeTab === "upcoming" 
                          ? "You don't have any upcoming deliveries scheduled."
                          : "You don't have any completed deliveries yet."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order Details</TableHead>
                            <TableHead className="hidden sm:table-cell">Pickup</TableHead>
                            <TableHead className="hidden sm:table-cell">Delivery</TableHead>
                            <TableHead className="hidden lg:table-cell">Status</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDeliveries.map((delivery, index) => {
                            const pickupTime = formatDateTime(delivery.pickupDateTime);
                            const arrivalTime = formatDateTime(delivery.arrivalDateTime);
                            const completeTime = delivery.completeDateTime ? 
                              formatDateTime(delivery.completeDateTime) : null;
                            
                            return (
                              <TableRow key={`${delivery.id}-${index}`} className="group">
                                <TableCell>
                                  <div className="flex flex-col space-y-1">
                                    <Link
                                      href={`/driver/deliveries/${delivery.order_number}`}
                                      className="font-medium hover:underline text-primary"
                                    >
                                      #{delivery.order_number}
                                    </Link>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      {getDeliveryTypeBadge(delivery.delivery_type)}
                                    </div>
                                    <HoverCard>
                                      <HoverCardTrigger asChild>
                                        <div className="text-sm text-muted-foreground cursor-help mt-1">
                                          {delivery.client_attention.length > 30 
                                            ? delivery.client_attention.substring(0, 30) + '...' 
                                            : delivery.client_attention}
                                        </div>
                                      </HoverCardTrigger>
                                      <HoverCardContent className="w-80">
                                        <div className="space-y-2">
                                          <h4 className="text-sm font-semibold">Client Instructions</h4>
                                          <p className="text-sm">{delivery.client_attention}</p>
                                          {delivery.specialNotes && (
                                            <>
                                              <h4 className="text-sm font-semibold">Special Notes</h4>
                                              <p className="text-sm">{delivery.specialNotes}</p>
                                            </>
                                          )}
                                          {delivery.pickupNotes && (
                                            <>
                                              <h4 className="text-sm font-semibold">Pickup Notes</h4>
                                              <p className="text-sm">{delivery.pickupNotes}</p>
                                            </>
                                          )}
                                          {getAdditionalDeliveryInfo(delivery).length > 0 && (
                                            <>
                                              <h4 className="text-sm font-semibold">Additional Details</h4>
                                              <ul className="text-sm list-disc pl-4">
                                                {getAdditionalDeliveryInfo(delivery).map((info, i) => (
                                                  <li key={i}>{info}</li>
                                                ))}
                                              </ul>
                                            </>
                                          )}
                                        </div>
                                      </HoverCardContent>
                                    </HoverCard>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                      <div className="font-medium">{delivery.address.street1}</div>
                                      <div className="text-muted-foreground">
                                        {delivery.address.city}, {delivery.address.state}
                                      </div>
                                      {delivery.address.latitude && delivery.address.longitude && (
                                        <a
                                          href={`https://maps.google.com/?q=${delivery.address.latitude},${delivery.address.longitude}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                                        >
                                          Open in Maps
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  {delivery.delivery_address ? (
                                    <div className="flex items-start space-x-2">
                                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                      <div className="text-sm">
                                        <div className="font-medium">{delivery.delivery_address.street1}</div>
                                        <div className="text-muted-foreground">
                                          {delivery.delivery_address.city}, {delivery.delivery_address.state}
                                        </div>
                                        {delivery.delivery_address.latitude && delivery.delivery_address.longitude && (
                                          <a
                                            href={`https://maps.google.com/?q=${delivery.delivery_address.latitude},${delivery.delivery_address.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                                          >
                                            Open in Maps
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">N/A</span>
                                  )}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <div className="flex flex-col space-y-1">
                                    {getStatusBadge(delivery.status, delivery.driverStatus)}
                                    <div className="text-sm text-muted-foreground">
                                      {delivery.user?.name || delivery.user?.email || 'Unknown Client'}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex flex-col items-end space-y-1">
                                    <div className="whitespace-nowrap font-medium">
                                      {pickupTime.time}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {pickupTime.date}
                                    </div>
                                    {activeTab !== "completed" && (
                                      <Badge 
                                        variant="outline" 
                                        className={`whitespace-nowrap text-xs ${
                                          new Date(delivery.pickupDateTime) < new Date() 
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                        }`}
                                      >
                                        {getTimeUntil(delivery.pickupDateTime)}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    {deliveries.length > limit && (
                      <div className="mt-6 flex justify-between">
                        <Button 
                          variant="outline"
                          onClick={handlePrevPage} 
                          disabled={page === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleNextPage}
                          disabled={filteredDeliveries.length < limit}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DriverDeliveries;