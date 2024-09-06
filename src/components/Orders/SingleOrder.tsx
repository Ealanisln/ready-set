"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MoreVertical, Truck, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import DriverStatusCard from "./DriverStatus";

interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

interface Order {
  id: string;
  guid: string | null;
  user_id: string;
  address_id: string;
  delivery_address_id?: string;
  brokerage?: string;
  order_number: string;
  driver_status: string;
  date: string;
  pickup_time: string;
  arrival_time: string;
  complete_time: string;
  headcount?: string;
  need_host?: string;
  hours_needed?: string;
  number_of_host?: string;
  client_attention: string;
  pickup_notes: string;
  special_notes: string;
  image: string | null;
  status: "active" | "assigned" | "cancelled" | "completed";
  order_total: string;
  driver_id?: string;
  driverInfo?: Driver;
  tip: string;
  user: {
    name: string | null;
    email: string | null;
  };
  address: Address;
  delivery_address?: Address;
  dispatch: {
    driver: Driver;
  }[];
  order_type: "catering" | "on_demand";
  item_delivered?: string;
  vehicle_type?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  created_at: string | null;
  updated_at: string | null;
}

interface Address {
  id: string;
  user_id: string;
  county: string;
  vendor: string | null;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  zip: string;
  location_number: string | null;
  parking_loading: string;
  status: string;
  created_at: string;
  updated_at: string;
}

enum DriverStatus {
  not_started = "not_started",
  arrived_at_vendor = "arrived_at_vendor",
  en_route_to_client = "en_route_to_client",
  arrived_to_client = "arrived_to_client",
}

const driverStatusMap: Record<DriverStatus, string> = {
  [DriverStatus.not_started]: "📋 Not Started",
  [DriverStatus.arrived_at_vendor]: "🏪 At Vendor",
  [DriverStatus.en_route_to_client]: "🚚 On the Way",
  [DriverStatus.arrived_to_client]: "🏁 Arrived",
};

const driverStatusProgress: Record<DriverStatus, number> = {
  [DriverStatus.not_started]: 0,
  [DriverStatus.arrived_at_vendor]: 33,
  [DriverStatus.en_route_to_client]: 66,
  [DriverStatus.arrived_to_client]: 100,
};

const SingleOrder = () => {
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

      await fetchOrderDetails(); // Re-fetch the entire order details
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
      <Card className="mx-auto w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Order {order.order_number}
            </CardTitle>
            <CardDescription>
              Date: {new Date(order.date).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog
              open={isDriverDialogOpen}
              onOpenChange={setIsDriverDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => setIsDriverDialogOpen(true)}
                >
                  {driverInfo ? (
                    <Edit className="h-4 w-4" />
                  ) : (
                    <Truck className="h-4 w-4" />
                  )}
                  <span>{driverInfo ? "Edit Driver" : "Assign Driver"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>
                    {isDriverAssigned
                      ? "Edit Driver Assignment"
                      : "Assign Driver"}
                  </DialogTitle>
                  <DialogDescription>
                    {isDriverAssigned
                      ? "Modify the driver assignment for this order."
                      : "Select a driver to assign to this order."}
                  </DialogDescription>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.contact_number}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDriverSelection(driver.id)}
                            variant={
                              selectedDriver === driver.id
                                ? "default"
                                : "outline"
                            }
                          >
                            {selectedDriver === driver.id
                              ? "Selected"
                              : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <DialogFooter>
                  <Button
                    onClick={handleAssignOrEditDriver}
                    disabled={!selectedDriver}
                  >
                    {isDriverAssigned ? "Update Driver" : "Assign Driver"}
                  </Button>
                  <Button
                    onClick={() => setIsDriverDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Order Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {order.order_type === "catering" && (
                  <>
                    {order.headcount && (
                      <div>
                        Headcount:{" "}
                        <span className="font-medium">{order.headcount}</span>
                      </div>
                    )}
                    {order.need_host && (
                      <div>
                        Need Host:{" "}
                        <span className="font-medium">{order.need_host}</span>
                      </div>
                    )}
                    {order.number_of_host && (
                      <div>
                        Number of Hosts:{" "}
                        <span className="font-medium">
                          {order.number_of_host}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {order.order_type === "on_demand" && (
                  <>
                    {order.item_delivered && (
                      <div>
                        Item Delivered:{" "}
                        <span className="font-medium">
                          {order.item_delivered}
                        </span>
                      </div>
                    )}
                    {order.vehicle_type && (
                      <div>
                        Vehicle Type:{" "}
                        <span className="font-medium">
                          {order.vehicle_type}
                        </span>
                      </div>
                    )}
                    {order.length && order.width && order.height && (
                      <div>
                        Dimensions:{" "}
                        <span className="font-medium">
                          {order.length} x {order.width} x {order.height}
                        </span>
                      </div>
                    )}
                    {order.weight && (
                      <div>
                        Weight:{" "}
                        <span className="font-medium">{order.weight}</span>
                      </div>
                    )}
                  </>
                )}
                {order.hours_needed && (
                  <div>
                    Hours Needed:{" "}
                    <span className="font-medium">{order.hours_needed}</span>
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 grid grid-cols-2 gap-2">
                  <div className="font-semibold">
                    Total: ${order.order_total}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Tip: ${order.tip}</div>
                </div>
              </div>
              {order.order_type === "catering" && order.brokerage && (
                <div>
                  <h3 className="mb-2 font-semibold">Brokerage</h3>
                  <div className="text-sm">{order.brokerage}</div>
                </div>
              )}
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Pickup Address</h3>
                {order.address ? (
                  <address className="text-sm not-italic">
                    {order.address.street1}
                    <br />
                    {order.address.street2 && (
                      <>
                        {order.address.street2}
                        <br />
                      </>
                    )}
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.zip}
                  </address>
                ) : (
                  <p className="text-sm">No pickup address available</p>
                )}
              </div>
              {order.delivery_address && (
                <div>
                  <h3 className="mb-2 font-semibold">Delivery Address</h3>
                  <address className="text-sm not-italic">
                    {order.delivery_address.street1}
                    <br />
                    {order.delivery_address.street2 && (
                      <>
                        {order.delivery_address.street2}
                        <br />
                      </>
                    )}
                    {order.delivery_address.city},{" "}
                    {order.delivery_address.state} {order.delivery_address.zip}
                  </address>
                </div>
              )}
            </div>
            <Separator className="my-4" />

            <div>
              <h3 className="mb-2 font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  Customer:{" "}
                  <span className="font-medium">
                    {order.user?.name || "N/A"}
                  </span>
                </div>
                <div>
                  Email:{" "}
                  {order.user?.email ? (
                    <a
                      href={`mailto:${order.user.email}`}
                      className="font-medium"
                    >
                      {order.user.email}
                    </a>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 font-semibold">Additional Information</h3>
              <div className="grid gap-2 text-sm">
                <div>
                  Client Attention:{" "}
                  <span className="font-medium">{order.client_attention}</span>
                </div>
                <div>
                  Pickup Notes:{" "}
                  <span className="font-medium">{order.pickup_notes}</span>
                </div>
                <div>
                  Special Notes:{" "}
                  <span className="font-medium">{order.special_notes}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 flex flex-row items-center border-t px-6 py-3">
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
    </main>
  );
};

export default SingleOrder;
