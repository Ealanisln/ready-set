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
import { cn } from "@/lib/utils";

// Shared types
interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

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
  status: string;
  driver_status: string | null;
  order_total: string;
  special_notes: string | null;
  address: Address;
  delivery_address: Address | null;
  user_id: string;
  pickup_time: string;
  arrival_time: string;
  complete_time: string;
  updated_at: string | null;
  dispatch: Array<{
    driver: Driver;
  }>;
}

interface CateringOrder extends BaseOrder {
  order_type: "catering";
  headcount: string | null;
  need_host: "yes" | "no" | null;
  brokerage: string | null;
}

interface OnDemandOrder extends BaseOrder {
  order_type: "on_demand";
  item_delivered: string | null;
  vehicle_type: "Car" | "Van" | "Truck" | null;
}

type Order = CateringOrder | OnDemandOrder;

// DriverStatusCard component
interface DriverStatusCardProps {
  order: {
    id: string;
    status: string;
    driver_status: string | null;
    user_id: string;
    pickup_time: string;
    arrival_time: string;
    complete_time: string;
    updated_at: string | null;
  };
  driverInfo: Driver | null;
  updateDriverStatus: (newStatus: string) => Promise<void>;
}

const driverStatusMap: Record<string, string> = {
  assigned: "🚗 Assigned",
  arrived_at_vendor: "🏪 At Vendor",
  en_route_to_client: "🚚 On the Way",
  arrived_to_client: "🏁 Arrived",
  completed: "✅ Completed",
};

const driverStatusProgress: Record<string, number> = {
  assigned: 0,
  arrived_at_vendor: 25,
  en_route_to_client: 50,
  arrived_to_client: 75,
  completed: 100,
};

const DriverStatusCard: React.FC<DriverStatusCardProps> = ({
  order,
  driverInfo,
  updateDriverStatus,
}) => {
  const getProgressValue = (status: string | null) => {
    return driverStatusProgress[status || 'assigned'] || 0;
  };

  const getDisplayStatus = (status: string | null) => {
    return status ? driverStatusMap[status] || status : driverStatusMap['assigned'];
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Driver Details</CardTitle>
      </CardHeader>
      <CardContent>
        {driverInfo ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                Driver Name:{" "}
                <span className="font-medium">
                  {driverInfo.name || "Not assigned"}
                </span>
              </div>
              <div>
                Driver Email:{" "}
                <span className="font-medium">{driverInfo.email || "N/A"}</span>
              </div>
              <div>
                Driver Contact:{" "}
                <span className="font-medium">
                  {driverInfo.contact_number || "N/A"}
                </span>
              </div>
              <div>
                Updated At:{" "}
                <span className="font-medium">
                  {order.updated_at
                    ? new Date(order.updated_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="space-y-2 py-4">
              <div className="flex flex-col items-center justify-center">
                <span className="mb-2 text-xl font-medium">Drive Status</span>
                <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Update Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(driverStatusMap).map(([status, label]) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => updateDriverStatus(status)}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
              </div>
              <Progress
                value={getProgressValue(order.driver_status)}
                className="w-full"
                indicatorClassName="bg-yellow-400"
              />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Not Started</span>
                <span>Completed</span>
              </div>
            </div>
            <div className="flex justify-center">

            <Badge
                  variant="outline"
                  className={cn("px-4 py-2 text-lg font-medium", {
                    "border-yellow-300 bg-yellow-100 text-yellow-800":
                      order.driver_status === "assigned" || !order.driver_status,
                    "border-blue-300 bg-blue-100 text-blue-800":
                      order.driver_status === "arrived_at_vendor",
                    "border-green-300 bg-green-100 text-green-800":
                      order.driver_status === "en_route_to_client",
                    "border-purple-300 bg-purple-100 text-purple-800":
                      order.driver_status === "arrived_to_client",
                    "border-gray-300 bg-gray-100 text-gray-800":
                      order.driver_status === "completed",
                  })}
                >
                  {getDisplayStatus(order.driver_status)}
                </Badge>
                </div>
           
          </div>
        ) : (
          <div>No driver assigned to this order.</div>
        )}
      </CardContent>
    </Card>
  );
};

// DriverDashboard component
const DriverDashboard: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<Driver | null>(null);

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
        
        // Extract driver info from the dispatch array
        if (data.dispatch && data.dispatch.length > 0 && data.dispatch[0].driver) {
          setDriverInfo(data.dispatch[0].driver);
        } else {
          setDriverInfo(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

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

      if (!response.ok) {
        throw new Error("Failed to update driver status");
      }

      const updatedOrder: Order = await response.json();
      setOrder(updatedOrder);
      if (updatedOrder.dispatch && updatedOrder.dispatch.length > 0 && updatedOrder.dispatch[0].driver) {
        setDriverInfo(updatedOrder.dispatch[0].driver);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  if (error) return (
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
              variant={order.order_type === "catering" ? "secondary" : "default"}
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
    </div>
  );
};

export default DriverDashboard;