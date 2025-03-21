import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  MapPinIcon,
  FileTextIcon,
  UsersIcon,
  ClockIcon,
} from "lucide-react";
import OrderStatusCard from "./OrderStatus";
import { usePathname } from "next/navigation";

type OrderStatus = "active" | "assigned" | "cancelled" | "completed";
type DriverStatus =
  | "assigned"
  | "arrived_at_vendor"
  | "en_route_to_client"
  | "arrived_to_client"
  | "completed";

interface Address {
  street1?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

interface Dispatch {
  driver: Driver;
}

interface BaseOrder {
  id: string;
  order_number: string;
  date: string;
  status: OrderStatus;
  driver_status: DriverStatus | null;
  order_total: string;
  special_notes: string | null;
  address: Address;
  delivery_address: Address | null;
  dispatch?: Dispatch[];
  user_id: string;
  pickup_time: string | null;
  arrival_time: string | null;
  complete_time: string | null;
  updated_at: string | null;
}

interface CateringOrder extends BaseOrder {
  order_type: "catering";
  headcount: number | null;
}

interface OnDemandOrder extends BaseOrder {
  order_type: "on_demand";
}

type Order = CateringOrder | OnDemandOrder;

// Define a type that matches the expected props for DriverStatusCard
type DriverStatusCardOrder = {
  id: string;
  status: string;
  driver_status: string;
  user_id: string;
  pickup_time: string;
  arrival_time: string;
  complete_time: string;
  updated_at: string | null;
};

const UserOrderDetail: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchOrder = async () => {
      const orderNumber = pathname.split("/").pop();

      try {
        const response = await fetch(
          `/api/user-orders/${orderNumber}?include=dispatch.driver`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [pathname]);

  const formatAddress = (address: Address | null) => {
    if (!address) return "N/A";
    const { street1, city, state, zip } = address;
    return [street1, city, state, zip].filter(Boolean).join(", ") || "N/A";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString();
  };

  const updateDriverStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/user-orders/${order.order_number}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driver_status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      } else {
        throw new Error("Failed to update driver status");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
      // You might want to show an error message to the user here
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  if (!order)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Sorry, order not found.</p>
      </div>
    );

  const isCatering = order.order_type === "catering";
  const driverInfo =
    order.dispatch && order.dispatch[0] && order.dispatch[0].driver;

  // Create a compatible order object for DriverStatusCard
  const driverStatusCardOrder: DriverStatusCardOrder = {
    id: order.id,
    status: order.status,
    driver_status: order.driver_status || "",
    user_id: order.user_id,
    pickup_time: order.pickup_time || "",
    arrival_time: order.arrival_time || "",
    complete_time: order.complete_time || "",
    updated_at: order.updated_at,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Order Details</h1>
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Order #{order.order_number || "N/A"}
            </CardTitle>
            <Badge
              variant={isCatering ? "secondary" : "default"}
              className="text-sm"
            >
              {isCatering ? "Catering" : "On Demand"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="text-muted-foreground" />
              <span>{formatDate(order.date)}</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {order.status || "N/A"}
            </Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="text-muted-foreground" />
                <span className="font-semibold">Pickup Location</span>
              </div>
              <p className="text-sm">{formatAddress(order.address)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="text-muted-foreground" />
                <span className="font-semibold">Delivery Location</span>
              </div>
              <p className="text-sm">{formatAddress(order.delivery_address)}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <span className="text-muted-foreground text-sm">Total</span>
              <p className="font-semibold">
                ${Number(order.order_total).toFixed(2) || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Order Date</span>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{formatDate(order.date)}</span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Order Time</span>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{formatTime(order.date)}</span>
              </div>
            </div>
            {isCatering && (
              <div>
                <span className="text-muted-foreground text-sm">Headcount</span>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{(order as CateringOrder).headcount || "N/A"}</span>
                </div>
              </div>
            )}
            {!isCatering && (
              <div>
                <span className="text-muted-foreground text-sm">
                  Item Delivered
                </span>
                <div className="flex items-center space-x-1">
                  <FileTextIcon className="h-4 w-4" />
                  <span>N/A</span>
                </div>
              </div>
            )}
          </div>
          <Separator />
          <div>
            <span className="text-muted-foreground text-sm">Special Notes</span>
            <p>{order.special_notes || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <OrderStatusCard
          order={driverStatusCardOrder}
          driverInfo={driverInfo || null}
        />
      </div>
    </div>
  );
};

export default UserOrderDetail;
