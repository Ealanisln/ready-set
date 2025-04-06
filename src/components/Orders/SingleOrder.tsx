// src/components/Orders/SingleOrder.tsx

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion"; // Added for animations
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, AlertCircle, Truck, User, Calendar, MapPin, FileText } from "lucide-react"; // Added more icons
import toast from "react-hot-toast";
import { DriverStatusCard } from "./DriverStatus";
import OrderHeader from "./ui/OrderHeader";
import OrderDetails from "./ui/OrderDetails";
import AddressInfo from "./ui/AddressInfo";
import CustomerInfo from "./ui/CustomerInfo";
import AdditionalInfo from "./ui/AdditionalInfo";
import DriverAssignmentDialog from "./ui/DriverAssignmentDialog";
import OrderStatusCard from "./OrderStatus";
import { usePathname } from "next/navigation";
import { OrderFilesManager } from "./ui/OrderFiles";
import { Driver, Order, OrderStatus, OrderType } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton"; // Added for loading states
import { FileUpload } from '@/types/file';

interface SingleOrderProps {
  onDeleteSuccess: () => void;
}

// Added status config similar to CateringOrdersPage
const statusConfig = {
  active: { className: "bg-amber-100 text-amber-800 hover:bg-amber-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  assigned: { className: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: <Truck className="h-3 w-3 mr-1" /> },
  cancelled: { className: "bg-red-100 text-red-800 hover:bg-red-200", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
  completed: { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", icon: <ClipboardList className="h-3 w-3 mr-1" /> },
};

const getStatusConfig = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig] || { className: "bg-gray-100 text-gray-800 hover:bg-gray-200", icon: null };
};

// Added loading skeleton for better UX
const OrderSkeleton: React.FC = () => (
  <div className="space-y-6 p-4 w-full max-w-5xl mx-auto">
    <Card>
      <CardHeader className="p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 p-6">
        <Skeleton className="h-24 w-full" />
        <Separator />
        <div className="space-y-4">
          <Skeleton className="h-6 w-[140px]" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Separator />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
  </div>
);

const SingleOrder: React.FC<SingleOrderProps> = ({ onDeleteSuccess }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isDriverAssigned, setIsDriverAssigned] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<Driver | null>(null);
  const [files, setFiles] = useState<FileUpload[]>([]);

  const pathname = usePathname();
  const orderNumber = pathname.split("/").pop() || "";

  const fetchOrderDetails = useCallback(async () => {
    if (!orderNumber) {
      console.error("No order number available");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("Fetching order details for:", orderNumber);

    try {
      // Fetch order details
      const orderResponse = await fetch(
        `/api/orders/${orderNumber}?include=dispatch.driver`,
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to fetch order details");
      }

      const orderData = await orderResponse.json();
      console.log("Order data received:", orderData);
      setOrder(orderData);

      // Set driver info if available
      if (orderData.dispatch?.length > 0 && orderData.dispatch[0].driver) {
        setDriverInfo(orderData.dispatch[0].driver);
        setIsDriverAssigned(true);
      } else {
        setDriverInfo(null);
        setIsDriverAssigned(false);
      }

      // Fetch files with improved error handling
      try {
        console.log(`Fetching files for order: ${orderNumber}`);
        const filesResponse = await fetch(`/api/orders/${orderNumber}/files`);

        const contentType = filesResponse.headers.get("content-type");

        if (!filesResponse.ok) {
          if (contentType?.includes("application/json")) {
            const errorData = await filesResponse.json();
            throw new Error(errorData.message || "Failed to fetch files");
          } else {
            const errorText = await filesResponse.text();
            throw new Error(errorText || "Failed to fetch files");
          }
        }

        const filesData = await filesResponse.json();
        console.log("Files data received:", filesData);

        // Convert object to array if necessary
        const filesArray = Object.values(filesData);

        if (!Array.isArray(filesArray)) {
          throw new Error("Invalid files data format");
        }

        const transformedFiles = filesArray.map((file: any) => ({
          ...file,
          // Handle empty date objects by using current date as fallback
          uploadedAt:
            file.uploadedAt && Object.keys(file.uploadedAt).length > 0
              ? new Date(file.uploadedAt)
              : new Date(),
          updatedAt:
            file.updatedAt && Object.keys(file.updatedAt).length > 0
              ? new Date(file.updatedAt)
              : new Date(),
          // Ensure cateringRequestId is handled correctly
          cateringRequestId: file.cateringRequestId
            ? Number(file.cateringRequestId)
            : null,
          // Ensure other numeric fields are handled correctly
          fileSize: Number(file.fileSize),
          onDemandId: file.onDemandId ? Number(file.onDemandId) : null,
        }));

        setFiles(transformedFiles);
      } catch (fileError) {
        console.error("Error fetching files:", fileError);
        toast.error(
          fileError instanceof Error
            ? fileError.message
            : "Failed to load order files",
        );
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber]);

  // Fetch order details on mount
  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Fetch drivers on mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("/api/drivers");
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
  }, []);

  const handleOpenDriverDialog = () => {
    setIsDriverDialogOpen(true);
    if (driverInfo) {
      setSelectedDriver(driverInfo.id);
    }
  };

  const handleAssignOrEditDriver = async () => {
    if (!order || !selectedDriver) return;

    try {
      const response = await fetch("/api/orders/assignDriver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          driverId: selectedDriver,
          order_type: order.order_type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign/edit driver");
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
      toast.error("Failed to assign/edit driver. Please try again.");
    }
  };

  const handleDriverSelection = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const updateDriverStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driverStatus: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };

  const handleOrderStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="mb-4 rounded-full bg-slate-100 p-3">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">Order Not Found</h2>
            <p className="mb-6 text-slate-500">
              We couldn't find order: <span className="font-medium">{orderNumber}</span>
            </p>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
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
      className="container mx-auto space-y-6 p-6"
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Order Status Overview Card */}
        <Card className="overflow-hidden shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="p-6 border-b bg-slate-50">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Order {order.orderNumber}
                  </h1>
                  {order.status && (
                    <Badge className={`${getStatusConfig(order.status as string).className} flex items-center w-fit gap-1 px-2 py-0.5 font-semibold text-xs capitalize`}>
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
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all hover:shadow-md"
                  onClick={handleOpenDriverDialog}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  {isDriverAssigned ? "Update Driver" : "Assign Driver"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <OrderHeader
            orderNumber={order.orderNumber}
            date={order.pickupDateTime || null} 
            driverInfo={driverInfo}
            onAssignDriver={handleOpenDriverDialog}
            order_type={order.order_type}
            orderId={order.id}
            onDeleteSuccess={onDeleteSuccess}
          />
          <Separator />

          <CardContent className="space-y-6 p-6">
            <div className="bg-slate-50 rounded-lg p-4 border">
              <OrderStatusCard
                order_type={order.order_type}
                initialStatus={order.status}
                orderId={order.id}
                onStatusChange={handleOrderStatusChange}
              />
            </div>

            <Separator />

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-amber-500" />
                Order Details
              </h3>
              <OrderDetails order={order} />
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {order.pickupAddress && (
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-semibold mb-3 text-slate-800 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                    Pickup Address
                  </h3>
                  <AddressInfo address={order.pickupAddress} title="" />
                </div>
              )}
              {order.deliveryAddress && (
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-semibold mb-3 text-slate-800 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                    Delivery Address
                  </h3>
                  <AddressInfo address={order.deliveryAddress} title="" />
                </div>
              )}
            </div>

            <Separator />

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-slate-800 flex items-center">
                <User className="h-5 w-5 mr-2 text-amber-500" />
                Customer Information
              </h3>
              <CustomerInfo 
                name={order.user?.name} 
                email={order.user?.email} 
                phone={order.user?.contactNumber} 
              />
            </div>

            <Separator />

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-slate-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-500" />
                Additional Information
              </h3>
              <AdditionalInfo
                clientAttention={order.clientAttention}
                pickupNotes={order.pickupNotes}
                specialNotes={order.specialNotes}
              />
            </div>
          </CardContent>
        </Card>

        {/* Files Card */}
        <Card className="overflow-hidden shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="border-b bg-slate-50 p-6">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Order Files
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <OrderFilesManager
              orderNumber={order.orderNumber}
              order_type={order.order_type}
              orderId={order.id.toString()}
              initialFiles={files}
            />
          </CardContent>
        </Card>

        {/* Driver Card */}
        <Card className="overflow-hidden shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="border-b bg-slate-50 p-6">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Driver Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DriverStatusCard
              order={{
                id: Number(order.id),
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