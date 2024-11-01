import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DriverStatus, OrderStatus } from "@/types/order";

interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

interface DriverStatusCardProps {
  order: {
    id: number; // Changed from string to number to match BaseOrder
    status: OrderStatus; // Use the enum type
    driver_status: DriverStatus | null; // Use the enum type
    user_id: string;
    pickup_time: string | Date; // Match BaseOrder type
    arrival_time: string | Date; // Match BaseOrder type
    complete_time: string | Date | null; // Match BaseOrder type
    updated_at: string | Date; // Match BaseOrder type
  };
  driverInfo: Driver | null;
  updateDriverStatus: (newStatus: DriverStatus) => Promise<void>; // Use enum type
}

// Update the status maps to use the enum
const driverStatusMap: Record<DriverStatus, string> = {
  [DriverStatus.assigned]: "🚗 Assigned",
  [DriverStatus.arrived_at_vendor]: "🏪 At Vendor",
  [DriverStatus.en_route_to_client]: "🚚 On the Way",
  [DriverStatus.arrived_to_client]: "🏁 Arrived",
  [DriverStatus.completed]: "✅ Completed",
};

const driverStatusProgress: Record<DriverStatus, number> = {
  [DriverStatus.assigned]: 0,
  [DriverStatus.arrived_at_vendor]: 25,
  [DriverStatus.en_route_to_client]: 50,
  [DriverStatus.arrived_to_client]: 75,
  [DriverStatus.completed]: 100,
};

export const DriverStatusCard: React.FC<DriverStatusCardProps> = ({
  order,
  driverInfo,
  updateDriverStatus,
}) => {
  const getProgressValue = (status: DriverStatus | null) => {
    return driverStatusProgress[status || "assigned"] || 0;
  };

  const getDisplayStatus = (status: DriverStatus | null) => {
    return status
      ? driverStatusMap[status] || status
      : driverStatusMap["assigned"];
  };

  return (
    <Card className="mx-auto w-full max-w-5xl">
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
                <Badge
                  variant="outline"
                  className={cn("px-4 py-2 text-lg font-medium", {
                    "border-yellow-300 bg-yellow-100 text-yellow-800":
                      order.driver_status === DriverStatus.assigned ||
                      !order.driver_status,
                    "border-blue-300 bg-blue-100 text-blue-800":
                      order.driver_status === DriverStatus.arrived_at_vendor,
                    "border-green-300 bg-green-100 text-green-800":
                      order.driver_status === DriverStatus.en_route_to_client,
                    "border-purple-300 bg-purple-100 text-purple-800":
                      order.driver_status === DriverStatus.arrived_to_client,
                    "border-gray-300 bg-gray-100 text-gray-800":
                      order.driver_status === DriverStatus.completed,
                  })}
                >
                  {getDisplayStatus(order.driver_status)}
                </Badge>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Update Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(driverStatusMap).map(([status, label]) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => updateDriverStatus(status as DriverStatus)}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div>No driver assigned to this order.</div>
        )}
      </CardContent>
    </Card>
  );
};
