import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  MapPinIcon,
  FileTextIcon,
  CarIcon,
  UsersIcon,
  CheckIcon,
} from "lucide-react";

type OrderStatus = "active" | "assigned" | "cancelled" | "completed";
type DriverStatus =
  | "assigned"
  | "arrived_at_vendor"
  | "en_route_to_client"
  | "arrived_to_client"
  | "completed"
  | null;
type OrderType = "catering" | "on_demand";

interface Address {
  street1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface BaseOrder {
  id: string;
  order_number: string;
  date: string;
  status: OrderStatus;
  driver_status: DriverStatus;
  order_total: string;
  special_notes: string | null;
  address: Address;
  delivery_address: Address | null;
}

interface CateringOrder extends BaseOrder {
  order_type: "catering";
  headcount?: string | null;
  need_host?: "yes" | "no" | null;
}

interface OnDemandOrder extends BaseOrder {
  order_type: "on_demand";
  item_delivered?: string | null;
  vehicle_type?: "Car" | "Van" | "Truck" | null;
}

type Order = CateringOrder | OnDemandOrder;

const driverStatuses: Record<OrderType, DriverStatus[]> = {
  on_demand: [
    "assigned",
    "arrived_at_vendor",
    "en_route_to_client",
    "arrived_to_client",
    "completed",
  ],
  catering: [
    "assigned",
    "arrived_at_vendor",
    "en_route_to_client",
    "arrived_to_client",
    "completed",
  ],
};

const DriverDashboard: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderNumber = window.location.pathname.split("/").pop();

      try {
        const response = await fetch(`/api/orders/${orderNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data: Order = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const updateDriverStatus = async (newStatus: DriverStatus) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.order_number}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driver_status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update driver status");
      }

      const updatedOrder: Order = await response.json();
      setOrder(updatedOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  const currentStatusIndex = driverStatuses[order.order_type].indexOf(
    order.driver_status || "assigned",
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Order Dashboard</h1>
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Order #{order.order_number}
            </CardTitle>
            <Badge
              variant={
                order.order_type === "catering" ? "secondary" : "default"
              }
              className="text-sm"
            >
              {order.order_type === "catering" ? "Catering" : "On Demand"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="text-muted-foreground" />
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {order.status}
            </Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="text-muted-foreground" />
                <span className="font-semibold">Pickup Location</span>
              </div>
              <p className="text-sm">{`${order.address.street1}, ${order.address.city}, ${order.address.state} ${order.address.zip}`}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="text-muted-foreground" />
                <span className="font-semibold">Delivery Location</span>
              </div>
              <p className="text-sm">
                {order.delivery_address
                  ? `${order.delivery_address.street1}, ${order.delivery_address.city}, ${order.delivery_address.state} ${order.delivery_address.zip}`
                  : "N/A"}
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <span className="text-muted-foreground text-sm">Total</span>
              <p className="font-semibold">
                ${Number(order.order_total).toFixed(2)}
              </p>
            </div>
            {order.order_type === "on_demand" ? (
              <>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Item Delivered
                  </span>
                  <div className="flex items-center space-x-1">
                    <FileTextIcon className="h-4 w-4" />
                    <span>{order.item_delivered || "N/A"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Vehicle Type
                  </span>
                  <div className="flex items-center space-x-1">
                    <CarIcon className="h-4 w-4" />
                    <span>{order.vehicle_type || "N/A"}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Headcount
                  </span>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-4 w-4" />
                    <span>{order.headcount || "N/A"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Need Host
                  </span>
                  <p>{order.need_host || "N/A"}</p>
                </div>
              </>
            )}
            <div>
              <span className="text-muted-foreground text-sm">
                Special Notes
              </span>
              <p>{order.special_notes || "N/A"}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Driver Status</span>
              <span className="text-muted-foreground text-sm">
                {currentStatusIndex + 1} of{" "}
                {driverStatuses[order.order_type].length} steps completed
              </span>
            </div>
            <Progress
              value={
                ((currentStatusIndex + 1) /
                  driverStatuses[order.order_type].length) *
                100
              }
              className="w-full"
            />
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>Assigned</span>
              <span>Completed</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full">Update Driver Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Update Driver Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {driverStatuses[order.order_type].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onSelect={() => updateDriverStatus(status as DriverStatus)}
                >
                  <div className="flex items-center justify-between">
                    <span>{status?.replace(/_/g, " ")}</span>
                    {order.driver_status === status && (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DriverDashboard;
