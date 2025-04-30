// src/components/Orders/SingleOrder.tsx

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, AlertCircle, Truck, User, Calendar, MapPin, FileText, ChevronUp, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { DriverStatusCard } from "./DriverStatus";
import OrderHeader from "./ui/OrderHeader";
import OrderDetails from "./ui/OrderDetails";
import AddressInfo from "./ui/AddressInfo";
import CustomerInfo from "./ui/CustomerInfo";
import AdditionalInfo from "./ui/AdditionalInfo";
import DriverAssignmentDialog from "./ui/DriverAssignmentDialog";
import OrderStatusCard from "./OrderStatus";
import { usePathname, useRouter } from "next/navigation";
import { OrderFilesManager } from "./ui/OrderFiles";
import { Driver, Order, OrderStatus, OrderType, VehicleType, DriverStatus } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUpload } from '@/types/file';
import { createClient } from "@/utils/supabase/client";
import { syncOrderStatusWithBroker } from "@/lib/services/brokerSyncService";

interface SingleOrderProps {
  onDeleteSuccess: () => void;
  showHeader?: boolean;
}

// Enhanced status config with more detailed styling
const statusConfig = {
  active: { className: "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  assigned: { className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200", icon: <Truck className="h-3 w-3 mr-1" /> },
  cancelled: { className: "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  completed: { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200", icon: <ClipboardList className="h-3 w-3 mr-1" /> },
};

const getStatusConfig = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig] || { className: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200", icon: null };
};

// Improved loading skeleton for better UX
const OrderSkeleton: React.FC = () => (
  <div className="space-y-6 p-4 w-full max-w-5xl mx-auto">
    <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px] rounded-md" />
          <Skeleton className="h-10 w-[150px] rounded-md" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 p-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Separator />
        <div className="space-y-4">
          <Skeleton className="h-6 w-[140px] rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <Separator />
        <Skeleton className="h-20 w-full rounded-lg" />
      </CardContent>
    </Card>
    <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="pt-6">
        <Skeleton className="h-40 w-full rounded-lg" />
      </CardContent>
    </Card>
  </div>
);

const SingleOrder: React.FC<SingleOrderProps> = ({ onDeleteSuccess, showHeader = true }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isDriverAssigned, setIsDriverAssigned] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<Driver | null>(null);
  const [files, setFiles] = useState<FileUpload[]>([]);
  
  // Adding accordion state for collapsible sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    driverStatus: true,
    orderDetails: true,
    addresses: true,
    customerInfo: true,
    additionalInfo: true,
    files: true
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const orderNumber = (pathname ?? '').split("/").pop() || "";
  const supabase = createClient();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const fetchOrderDetails = useCallback(async () => {
    if (!orderNumber) {
      console.error("No order number available");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("Fetching order details for:", orderNumber);

    try {
      // Refresh auth session before making the request
      await supabase.auth.refreshSession();
      
      // Fetch order details
      const orderResponse = await fetch(
        `/api/orders/${orderNumber}?include=dispatch.driver`,
        {
          credentials: 'include' // Ensure cookies are sent with the request
        }
      );

      if (!orderResponse.ok) {
        // Get more detailed error information
        let errorText = '';
        try {
          const errorData = await orderResponse.json();
          errorText = JSON.stringify(errorData);
        } catch (parseError) {
          errorText = 'Could not parse error response';
        }
        
        console.error(`Order API error (${orderResponse.status}): ${errorText}`);
        throw new Error(`HTTP error! status: ${orderResponse.status}, details: ${errorText}`);
      }

      const orderData = await orderResponse.json();
      console.log("Order data received:", orderData);
      
      // Transform the data to match our types
      const transformedOrder: Order = {
        ...orderData,
        // Ensure required fields for OnDemand orders
        ...(orderData.order_type === 'on_demand' && {
          vehicleType: orderData.vehicleType || VehicleType.CAR
        }),
        id: String(orderData.id)
      };
      
      setOrder(transformedOrder);

      // Set driver info if available
      if (orderData.dispatches?.length > 0 && orderData.dispatches[0]?.driver) {
        setDriverInfo(orderData.dispatches[0].driver);
        setIsDriverAssigned(true);
      } else {
        setDriverInfo(null);
        setIsDriverAssigned(false);
      }

      // Fetch files with improved error handling
      try {
        console.log(`Fetching files for order: ${orderNumber}`);
        const filesResponse = await fetch(`/api/orders/${orderNumber}/files`, {
          credentials: 'include'
        });

        if (!filesResponse.ok) {
          throw new Error("Failed to fetch files");
        }

        const filesData = await filesResponse.json();
        console.log("Files data received:", filesData);

        const filesArray = Array.isArray(filesData) ? filesData : Object.values(filesData);
        const transformedFiles = filesArray.map((file: any) => ({
          ...file,
          uploadedAt: file.uploadedAt ? new Date(file.uploadedAt) : new Date(),
          updatedAt: file.updatedAt ? new Date(file.updatedAt) : new Date(),
          cateringRequestId: file.cateringRequestId ? Number(file.cateringRequestId) : null,
          fileSize: Number(file.fileSize),
          onDemandId: file.onDemandId ? Number(file.onDemandId) : null,
        }));

        setFiles(transformedFiles);
      } catch (fileError) {
        console.error("Error fetching files:", fileError);
        toast.error("Failed to load order files");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber, supabase.auth, setIsLoading, setOrder, setDriverInfo, setIsDriverAssigned, setFiles]);

  // Fetch order details on mount
  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Fetch drivers on mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // Refresh auth session before making the request 
        await supabase.auth.refreshSession();
        
        const response = await fetch("/api/drivers", {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          console.error("Failed to fetch drivers");
          toast.error("Failed to load available drivers");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("An error occurred while loading drivers");
      }
    };

    fetchDrivers();
  }, [setDrivers, supabase.auth]);

  const handleOpenDriverDialog = () => {
    setIsDriverDialogOpen(true);
    if (driverInfo) {
      setSelectedDriver(driverInfo.id);
    }
  };

  const handleAssignOrEditDriver = async () => {
    if (!order || !selectedDriver) return;

    try {
      // Refresh auth session before making the request
      await supabase.auth.refreshSession();
      
      const response = await fetch("/api/orders/assignDriver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          orderId: order.id,
          driverId: selectedDriver,
          orderType: order.order_type === "on_demand" ? "on_demand" : "catering",
        }),
      });

      if (!response.ok) {
        // Get error details
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || '';
        } catch (parseError) {
          errorText = '';
        }
        
        throw new Error(`Failed to assign/edit driver: ${errorText || response.statusText}`);
      }

      await fetchOrderDetails();
      setIsDriverDialogOpen(false);
      toast.success(
        isDriverAssigned
          ? "Driver updated successfully!"
          : "Driver assigned successfully!",
      );
    } catch (error) {
      console.error("Failed to assign/edit driver:", error);
      toast.error(error instanceof Error ? error.message : "Failed to assign/edit driver. Please try again.");
    }
  };

  const handleDriverSelection = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const updateDriverStatus = async (newStatus: DriverStatus) => {
    if (!order) return;

    try {
      // Refresh auth session before making the request
      await supabase.auth.refreshSession();
      
      console.log(`Updating driver status for order ${order.orderNumber} to:`, newStatus);
      
      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ driverStatus: newStatus }),
      });

      if (!response.ok) {
        // Get error details
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || '';
        } catch (parseError) {
          errorText = '';
        }
        
        throw new Error(`Failed to update driver status: ${errorText || response.statusText}`);
      }

      const updatedOrder = await response.json();
      console.log(`Driver status for order ${order.orderNumber} updated response:`, updatedOrder);
      setOrder(updatedOrder);
      toast.success("Driver status updated successfully!");

      // If driver status is updated to completed, also update the main order status
      console.log(`Checking if driver status '${newStatus}' requires order status update.`);
      if (newStatus === DriverStatus.COMPLETED) {
        console.log(`Triggering order status update to COMPLETED for order ${order.orderNumber}`);
        await handleOrderStatusChange(OrderStatus.COMPLETED);
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update driver status. Please try again.");
    }
  };

  const handleOrderStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    const internalUpdatePromise = async () => {
      // Refresh auth session before making the request
      await supabase.auth.refreshSession();

      console.log(`Updating internal ORDER status for order ${order.orderNumber} to:`, newStatus);

      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || '';
        } catch (parseError) {
          errorText = '';
        }
        throw new Error(`Failed to update internal order status: ${errorText || response.statusText}`);
      }
      const updatedOrderData = await response.json();
       console.log(`Internal order status for order ${order.orderNumber} updated response:`, updatedOrderData);
      // Ensure the returned data conforms to the Order type for the sync function
      return updatedOrderData as Order; 
    };

    try {
      // Perform internal update first
      const updatedOrder = await internalUpdatePromise();
      setOrder(updatedOrder); // Update local state immediately after internal success
      toast.success("Order status updated successfully!");

      // Sync with Broker
      await syncOrderStatusWithBroker(updatedOrder, newStatus);

    } catch (error) {
      // Error during internal update
      console.error("Error updating internal order status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update order status. Please try again.");
    }
  };

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center overflow-hidden border-slate-200 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 rounded-full bg-slate-100 p-3"
            >
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </motion.div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">Order Not Found</h2>
            <p className="mb-6 text-slate-500">
              We couldn't find order: <span className="font-medium">{orderNumber}</span>
            </p>
            <Button
              variant="default"
              onClick={() => window.history.back()}
              className="gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow transition-all hover:shadow-md"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6"
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Order header with metadata */}
        <Card className="overflow-hidden shadow-sm border-slate-200 rounded-xl">
          {showHeader && (
            <CardHeader className="p-6 border-b bg-white">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-800">
                      {order.order_type === 'catering' ? 'Catering Request' : 'On-Demand Order'} {order.orderNumber}
                    </h1>
                    {order.status && (
                      <Badge className={`${getStatusConfig(order.status as string).className} flex items-center w-fit gap-1 px-2 py-1 font-semibold text-xs capitalize shadow-sm`}>
                        {getStatusConfig(order.status as string).icon}
                        {order.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center mt-1 text-slate-500">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    {order.pickupDateTime ? (
                      <span className="text-sm">
                        {new Date(order.pickupDateTime).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-sm italic">No date specified</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow transition-all hover:shadow-md"
                    onClick={handleOpenDriverDialog}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    {isDriverAssigned ? "Update Driver" : "Assign Driver"}
                  </Button>
                </div>
              </div>
            </CardHeader>
          )}

          <OrderHeader
            orderNumber={order.orderNumber}
            date={order.pickupDateTime || null} 
            driverInfo={driverInfo}
            onAssignDriver={handleOpenDriverDialog}
            order_type={order.order_type}
            orderId={order.id}
            onDeleteSuccess={onDeleteSuccess}
          />
        </Card>

        {/* Driver Status Card */}
        <Card className="overflow-hidden shadow-sm rounded-xl border-slate-200">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-500" />
                Driver Status
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection('driverStatus')}>
                {expandedSections.driverStatus ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.driverStatus && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-6 bg-white">
                  <DriverStatusCard
                    order={{
                      id: order.id,
                      status: order.status,
                      driver_status: order.driverStatus,
                      user_id: order.userId,
                      pickup_time: order.pickupDateTime,
                      arrival_time: order.arrivalDateTime,
                      complete_time: order.completeDateTime,
                      updated_at: order.updatedAt,
                    }}
                    driverInfo={driverInfo}
                    updateDriverStatus={updateDriverStatus}
                  />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* On-Demand Order Status Card */}
        <Card className="overflow-hidden shadow-sm rounded-xl border-slate-200">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-amber-500" />
                Current Status
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <OrderStatusCard
              order_type={order.order_type}
              initialStatus={order.status}
              orderId={order.id}
              onStatusChange={handleOrderStatusChange}
            />
          </CardContent>
        </Card>

        {/* Order Details Card */}
        <Card className="overflow-hidden shadow-sm rounded-xl border-slate-200">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-amber-500" />
                Order Details
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection('orderDetails')}>
                {expandedSections.orderDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.orderDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-6 bg-white">
                  <OrderDetails order={order} />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Addresses Card */}
        <Card className="overflow-hidden shadow-sm rounded-xl border-slate-200">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                Addresses
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection('addresses')}>
                {expandedSections.addresses ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.addresses && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {order.pickupAddress && (
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h4 className="text-md font-semibold mb-3 text-slate-800 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                          Pickup Address
                        </h4>
                        <AddressInfo address={order.pickupAddress} title="" />
                      </div>
                    )}
                    {order.deliveryAddress && (
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h4 className="text-md font-semibold mb-3 text-slate-800 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                          Delivery Address
                        </h4>
                        <AddressInfo address={order.deliveryAddress} title="" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Customer Information Card */}
        <Card className="overflow-hidden shadow-sm rounded-xl border-slate-200">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <User className="h-5 w-5 mr-2 text-amber-500" />
                Customer Information
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection('customerInfo')}>
                {expandedSections.customerInfo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.customerInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-6 bg-white">
                  <CustomerInfo 
                    name={order.user?.name} 
                    email={order.user?.email} 
                    phone={order.user?.contactNumber} 
                  />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Additional Information Card */}
        <Card className="overflow-hidden shadow-sm rounded-xl border-slate-200">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-500" />
                Additional Information
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection('additionalInfo')}>
                {expandedSections.additionalInfo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.additionalInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-6 bg-white">
                  <AdditionalInfo
                    clientAttention={order.clientAttention}
                    pickupNotes={order.pickupNotes}
                    specialNotes={order.specialNotes}
                  />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Order Files Card */}
        <Card className="overflow-hidden shadow-sm rounded-xl border-slate-200">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-500" />
                Order Files
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleSection('files')}>
                {expandedSections.files ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedSections.files && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-6 bg-white">
                  <OrderFilesManager
                    orderNumber={order.orderNumber}
                    order_type={order.order_type}
                    orderId={order.id.toString()}
                    initialFiles={files}
                  />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      <DriverAssignmentDialog
        isOpen={isDriverDialogOpen}
        onOpenChange={setIsDriverDialogOpen}
        isDriverAssigned={isDriverAssigned}
        drivers={drivers}
        selectedDriver={selectedDriver}
        onDriverSelection={handleDriverSelection}
        onAssignOrEditDriver={handleAssignOrEditDriver}
      />
    </motion.main>
  );
};

export default SingleOrder;