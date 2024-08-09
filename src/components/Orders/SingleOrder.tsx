"use client";

import React, { useEffect, useState } from "react";
import { MoreVertical, Truck } from "lucide-react";

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatusCard from "./DriverStatus";
import toast from "react-hot-toast";

interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

interface CateringOrder {
  id: string;
  guid: string | null;
  user_id: string;
  address_id: string;
  delivery_address_id: string;
  brokerage: string;
  order_number: string;
  date: string;
  pickup_time: string;
  arrival_time: string;
  complete_time: string;
  headcount: string;
  need_host: string;
  hours_needed: string;
  number_of_host: string;
  client_attention: string;
  pickup_notes: string;
  special_notes: string;
  image: string | null;
  status: "active" | "assigned" | "cancelled" | "completed";
  order_total: string;
  tip: string;
  user: {
    name: string;
    email: string;
  };
  address: Address;
  delivery_address: Address;
  dispatch?: {
    driver: {
      id: string;
      name: string;
      email: string;
      contact_number: string;
    };
  } | null;
  user_type: string;
  service_id: string;
  service_type: string;
  driver_id: string | null;
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

interface Dispatch {
  id: string;
  driver: {
    id: string;
    name: string | null;
    email: string | null;
    contact_number: string | null;
  };
}

const SingleOrder = () => {
  const [order, setOrder] = useState<CateringOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isDriverAssigned, setIsDriverAssigned] = useState(false);


  useEffect(() => {
    const fetchOrder = async () => {
      const orderNumber = window.location.pathname.split("/").pop();
      try {
        console.log("Fetching order number:", orderNumber);
        const response = await fetch(`/api/catering-requests/${orderNumber}?include=dispatch.driver`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched order data:", data);
          setOrder(data);
        } else {
          console.error("Failed to fetch catering order");
        }
      } catch (error) {
        console.error("Error fetching catering order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("/api/drivers");
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          console.error("Failed to fetch drivers");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    // Check if a driver is assigned when the order is loaded or updated
    setIsDriverAssigned(!!order?.dispatch);
  }, [order]);

  const handleAssignDriver = async (driverId: string) => {
    if (!order) return;

    try {
      const response = await fetch("/api/catering-requests/assignDriver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order.id, driverId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign driver");
      }

      const updatedOrder = await response.json();
      setOrder({ ...order, driver_id: driverId });
      setIsDriverDialogOpen(false);
      toast.success("Driver assigned successfully!");
    } catch (error) {
      console.error("Failed to assign driver:", error);
      toast.error("Failed to assign driver. Please try again.");
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
                  disabled={isDriverAssigned}
                >
                  <Truck className="h-4 w-4" />
                  <span>
                    {isDriverAssigned ? "Driver Assigned" : "Assign Driver"}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>
                    {order?.dispatch ? "Reassign Driver" : "Assign Driver"}
                  </DialogTitle>
                  <DialogDescription>
                    Select a driver to assign to this order.
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
                          <Button onClick={() => handleAssignDriver(driver.id)}>
                            Assign
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <DialogFooter>
                  <Button onClick={() => setIsDriverDialogOpen(false)}>
                    Close
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
                {order.hours_needed && (
                  <div>
                    Hours Needed:{" "}
                    <span className="font-medium">{order.hours_needed}</span>
                  </div>
                )}
                {order.number_of_host && (
                  <div>
                    Number of Hosts:{" "}
                    <span className="font-medium">{order.number_of_host}</span>
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
              <div>
                <h3 className="mb-2 font-semibold">Brokerage</h3>
                <div className="text-sm">{order.brokerage}</div>
              </div>
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
                  {order.delivery_address.city}, {order.delivery_address.state}{" "}
                  {order.delivery_address.zip}
                </address>
              </div>
            </div>
            <Separator className="my-4" />

            <div>
              <h3 className="mb-2 font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  Customer:{" "}
                  <span className="font-medium">{order.user.name}</span>
                </div>
                <div>
                  Email:{" "}
                  <a
                    href={`mailto:${order.user.email}`}
                    className="font-medium"
                  >
                    {order.user.email}
                  </a>
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
        {order?.dispatch && (
          <div className="mt-4">
            <h3 className="font-semibold">Assigned Driver</h3>
            <p>Name: {order.dispatch.driver.name}</p>
            <p>Email: {order.dispatch.driver.email}</p>
            <p>Contact: {order.dispatch.driver.contact_number}</p>
          </div>
        )}

        <CardFooter className="bg-muted/50 flex flex-row items-center border-t px-6 py-3">
          <div className="text-md text-muted-foreground">
            Status: <span className="font-semibold">{order.status}</span>
          </div>
        </CardFooter>
        
      </Card>
      <div className="py-8">
        <OrderStatusCard order={order}/>
      </div>
    </main>
  );
};

export default SingleOrder;
