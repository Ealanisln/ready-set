import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  const [files, setFiles] = useState([]);

  const pathname = usePathname();
  const orderNumber = pathname.split("/").pop() || "";

  // In the getOrderTypeAndId function, update the type conversion:
  const getOrderTypeAndId = useCallback((order: Order | null) => {
    if (!order) return { orderType: null as OrderType | null, orderId: "" };

    // No need to transform the type since we're using the correct one from the database
    const orderType: OrderType = order.order_type;
    const orderId = order.id?.toString() || "";

    return { orderType, orderId };
  }, []);

  const getEntityType = (orderType: OrderType) => {
    return orderType;
  };

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/orders/${orderNumber}?include=dispatch.driver`,
      );
      if (response.ok) {
        const data = await response.json();
        setOrder(data);

        if (
          data.dispatch &&
          data.dispatch.length > 0 &&
          data.dispatch[0].driver
        ) {
          setDriverInfo(data.dispatch[0].driver);
          setIsDriverAssigned(true);
        } else {
          setDriverInfo(null);
          setIsDriverAssigned(false);
        }

        // Fetch files after we have the order details
        const { orderType, orderId } = getOrderTypeAndId(data);
        if (orderType && orderId) {
          const entityType = getEntityType(orderType);
          const filesResponse = await fetch(
            `/api/files/${entityType}/${orderId}`,
          );
          if (filesResponse.ok) {
            const filesData = await filesResponse.json();
            setFiles(filesData);
          } else {
            console.error("Failed to fetch files");
          }
        }
      } else {
        console.error("Failed to fetch order");
        toast.error("Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("An error occurred while loading order details");
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber, getOrderTypeAndId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

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

  // Update handleOrderStatusChange in SingleOrder.tsx
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
        <p className="ml-4 text-lg font-semibold">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  const { orderType, orderId } = getOrderTypeAndId(order);

  return (
    <main className="container mx-auto p-6">
      <Card className="mx-auto w-full max-w-5xl pt-2">
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

        <CardContent className="pt-6">
          <OrderStatusCard
            orderType={order.order_type as OrderType}
            initialStatus={order.status as OrderStatus}
            orderId={order.id}
            onStatusChange={(newStatus) => handleOrderStatusChange(newStatus)}
          />
        </CardContent>
        <Separator />

        <CardContent className="pt-6">
          <OrderDetails order={order} />
          <Separator />
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
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
          <Separator className="my-4" />
          <CustomerInfo name={order.user?.name} email={order.user?.email} />
          <Separator />
          <AdditionalInfo
            clientAttention={order.client_attention}
            pickupNotes={order.pickup_notes}
            specialNotes={order.special_notes}
          />
          <Separator />
          {orderType && orderId && (
            <OrderFilesManager
              orderNumber={order.order_number}
              orderType={orderType}
              orderId={orderId}
              initialFiles={files}
            />
          )}
        </CardContent>
      </Card>
      <div className="py-8">
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
