import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Update type definitions
type OrderStatus = "active" | "assigned" | "cancelled" | "completed";
type DriverStatus =
  | "arrived_at_vendor"
  | "en_route_to_client"
  | "arrived_to_client"
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

const SingleOrder: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the order number from the URL
    const pathSegments = window.location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    setOrderNumber(lastSegment);
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;

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
  }, [orderNumber]);

  const updateDriverStatus = async (newStatus: DriverStatus) => {
    if (!orderNumber) return;

    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
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

  return (
    <section id="contact" className="relative py-20 md:py-[120px]">
    <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
    <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
    <div className="container px-4">
    <div className="flex justify-center items-center">
    <Card className="w-full max-w-3xl">
            <CardHeader className="flex items-center justify-between">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Order #</span>
                  <span>{order.order_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Order Type:</span>
                  <span>
                    {order.order_type === "catering" ? "Catering" : "On Demand"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Order Status:</span>
                <span>{order.status}</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <span className="font-medium">Order Date:</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="grid gap-1">
                  <span className="font-medium">Pickup Location:</span>
                  <span>{`${order.address.street1}, ${order.address.city}, ${order.address.state} ${order.address.zip}`}</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <span className="font-medium">Delivery Location:</span>
                  <span>
                    {order.delivery_address
                      ? `${order.delivery_address.street1}, ${order.delivery_address.city}, ${order.delivery_address.state} ${order.delivery_address.zip}`
                      : "N/A"}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="font-medium">Total:</span>
                  <span>${Number(order.order_total).toFixed(2)}</span>
                </div>
              </div>
              {order.order_type === "catering" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <span className="font-medium">Headcount:</span>
                    <span>{(order as CateringOrder).headcount || "N/A"}</span>
                  </div>
                  <div className="grid gap-1">
                    <span className="font-medium">Need Host:</span>
                    <span>{(order as CateringOrder).need_host || "N/A"}</span>
                  </div>
                </div>
              )}
              {order.order_type === "on_demand" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <span className="font-medium">Item Delivered:</span>
                    <span>{(order as OnDemandOrder).item_delivered || "N/A"}</span>
                  </div>
                  <div className="grid gap-1">
                    <span className="font-medium">Vehicle Type:</span>
                    <span>{(order as OnDemandOrder).vehicle_type || "N/A"}</span>
                  </div>
                </div>
              )}
              <div className="grid gap-1">
                <span className="font-medium">Special Notes:</span>
                <span>{order.special_notes || "N/A"}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="grid gap-1">
                <span className="font-medium">Driver Status:</span>
                <span>{order.driver_status || "Not started"}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">Update Driver Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Update Driver Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(
                    [
                      "arrived_at_vendor",
                      "en_route_to_client",
                      "arrived_to_client",
                    ] as const
                  ).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() => updateDriverStatus(status)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{status.replace(/_/g, " ")}</span>
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
    </div>
    </section>
  );
};

export default SingleOrder;

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
