import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import DriverStatusCard from "./DriverStatus";
import OrderHeader from "./ui/OrderHeader";
import OrderDetails from "./ui/OrderDetails";
import AddressInfo from "./ui/AddressInfo";
import CustomerInfo from "./ui/CustomerInfo";
import AdditionalInfo from "./ui/AdditionalInfo";
import { Order, Driver } from "@/types/order";
import DriverAssignmentDialog from "./ui/DriverAssignmentDialog";

const SingleOrder: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isDriverAssigned, setIsDriverAssigned] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<Driver | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);
    const orderNumber = window.location.pathname.split("/").pop();
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
  }, []);

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

  return (
    <main className="container mx-auto p-4">
      <Card className="mx-auto w-full max-w-5xl py-4">
        <OrderHeader
          orderNumber={order.order_number}
          date={order.date}
          driverInfo={driverInfo}
          onAssignDriver={handleOpenDriverDialog}
        />
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
        </CardContent>
        <CardFooter className="bg-muted/50 flex flex-row items-center border-t px-6 py-6">
          <div className="text-md text-muted-foreground">
            Order status: <span className="font-semibold">{order.status}</span>
          </div>
        </CardFooter>
      </Card>
      <div className="py-8">
        <DriverStatusCard
          order={order}
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
