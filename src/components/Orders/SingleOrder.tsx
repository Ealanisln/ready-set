import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

interface FileUpload {
  id: string;
  fileName: string;
  fileType: string | null;
  fileSize: number;
  fileUrl: string;
  entityType: string;
  entityId: string;
  category?: string;
  uploadedAt: Date;
  updatedAt: Date;
  userId?: string;
  cateringRequestId?: number;
  onDemandId?: number;
}

interface SingleOrderProps {
  onDeleteSuccess: () => void;
}

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
    void fetchOrderDetails();
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

    void fetchDrivers();
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
          orderType: order.order_type,
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
      const response = await fetch(`/api/orders/${order.order_number}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driver_status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        toast.success("Driver status updated successfully!");
      } else {
        throw new Error("Failed to update driver status");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast.error("Failed to update driver status. Please try again.");
    }
  };

  const handleOrderStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.order_number}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        toast.success("Order status updated successfully!");
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">
          Loading order details for {orderNumber}...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">
          Order not found: {orderNumber}
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto space-y-6 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Card>
          <OrderHeader
            orderNumber={order.order_number}
            date={order.date}
            driverInfo={driverInfo}
            onAssignDriver={handleOpenDriverDialog}
            orderType={order.order_type as OrderType}
            orderId={order.id}
            onDeleteSuccess={onDeleteSuccess}
          />
          <Separator />

          <CardContent className="space-y-6">
            <OrderStatusCard
              orderType={order.order_type as OrderType}
              initialStatus={order.status as OrderStatus}
              orderId={order.id}
              onStatusChange={handleOrderStatusChange}
            />

            <Separator />

            <OrderDetails order={order} />
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {order.address && (
                <AddressInfo address={order.address} title="Pickup Address" />
              )}
              {order.delivery_address && (
                <AddressInfo
                  address={order.delivery_address}
                  title="Delivery Address"
                />
              )}
            </div>

            <Separator />
            
            <CustomerInfo name={order.user?.name} email={order.user?.email} />
            
            <Separator />
            
            <AdditionalInfo
              clientAttention={order.client_attention}
              pickupNotes={order.pickup_notes}
              specialNotes={order.special_notes}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <OrderFilesManager
              orderNumber={order.order_number}
              orderType={order.order_type as OrderType}
              orderId={order.id.toString()}
              initialFiles={files}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DriverStatusCard
              order={{
                id: order.id,
                status: order.status,
                driver_status: order.driver_status,
                user_id: order.user_id,
                pickup_time: order.pickup_time,
                arrival_time: order.arrival_time,
                complete_time: order.complete_time,
                updated_at: order.updated_at,
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
    </main>
  );
};

export default SingleOrder;