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

interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

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
                      onClick={() => updateDriverStatus(status)}
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

export default DriverStatusCard;