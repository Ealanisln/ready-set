import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Truck, AlertTriangle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { DriverStatus } from "@prisma/client";
import { useDriverStatus } from "@/hooks/useDriverStatus";
import { Toaster } from "sonner";

interface Driver {
  id: string;
  name?: string | null;
  email?: string | null;
  contactNumber?: string | null;
}

export interface OrderStatusUpdaterProps {
  order: {
    id: string;
    status: string;
    driverStatus?: DriverStatus | null;
    pickupDateTime?: string | Date | null;
    arrivalDateTime?: string | Date | null;
    completeDateTime?: string | Date | null;
    updatedAt: string | Date;
    orderNumber?: string | null;
  };
  orderType?: "catering" | "ondemand";
  driverInfo?: Driver | null;
  onStatusUpdate?: (data: any) => void;
  isEditable?: boolean;
}

const driverStatusMap: Record<DriverStatus, string> = {
  [DriverStatus.ASSIGNED]: "🚗 Assigned",
  [DriverStatus.ARRIVED_AT_VENDOR]: "🏪 At Vendor",
  [DriverStatus.EN_ROUTE_TO_CLIENT]: "🚚 On the Way",
  [DriverStatus.ARRIVED_TO_CLIENT]: "🏁 Arrived",
  [DriverStatus.COMPLETED]: "✅ Completed",
};

const driverStatusProgress: Record<DriverStatus, number> = {
  [DriverStatus.ASSIGNED]: 0,
  [DriverStatus.ARRIVED_AT_VENDOR]: 25,
  [DriverStatus.EN_ROUTE_TO_CLIENT]: 50,
  [DriverStatus.ARRIVED_TO_CLIENT]: 75,
  [DriverStatus.COMPLETED]: 100,
};

const driverStatusColors: Record<DriverStatus, string> = {
  [DriverStatus.ASSIGNED]: "bg-yellow-100 text-yellow-800 border-yellow-300",
  [DriverStatus.ARRIVED_AT_VENDOR]: "bg-blue-100 text-blue-800 border-blue-300",
  [DriverStatus.EN_ROUTE_TO_CLIENT]: "bg-green-100 text-green-800 border-green-300",
  [DriverStatus.ARRIVED_TO_CLIENT]: "bg-purple-100 text-purple-800 border-purple-300",
  [DriverStatus.COMPLETED]: "bg-slate-100 text-slate-800 border-slate-300",
};

export function OrderStatusUpdater({
  order,
  orderType = "catering",
  driverInfo,
  onStatusUpdate,
  isEditable = true,
}: OrderStatusUpdaterProps) {
  const { updateDriverStatus, isLoading } = useDriverStatus({
    onSuccess: (data) => {
      if (onStatusUpdate) {
        onStatusUpdate(data);
      }
    },
  });

  const getProgressValue = (status: DriverStatus | null | undefined) => {
    return status ? driverStatusProgress[status] : 0;
  };

  const getDisplayStatus = (status: DriverStatus | null | undefined) => {
    return status
      ? driverStatusMap[status]
      : driverStatusMap[DriverStatus.ASSIGNED];
  };

  const getStatusColor = (status: DriverStatus | null | undefined) => {
    return status
      ? driverStatusColors[status]
      : driverStatusColors[DriverStatus.ASSIGNED];
  };

  // Format dates/times for better display
  const formatDateTime = (dateTime: string | Date | null | undefined) => {
    if (!dateTime) return "Not yet";
    return format(new Date(dateTime), "MMM d, yyyy h:mm a");
  };

  // Calculate estimated time for delivery
  const getEstimatedTimeRemaining = (status: DriverStatus | null | undefined) => {
    if (!status || status === DriverStatus.COMPLETED) return null;
    
    let timeEstimate;
    switch(status) {
      case DriverStatus.ASSIGNED:
        timeEstimate = "~30-45 min";
        break;
      case DriverStatus.ARRIVED_AT_VENDOR:
        timeEstimate = "~20-30 min";
        break;
      case DriverStatus.EN_ROUTE_TO_CLIENT:
        timeEstimate = "~10-15 min";
        break;
      case DriverStatus.ARRIVED_TO_CLIENT:
        timeEstimate = "Completing delivery";
        break;
      default:
        timeEstimate = "Calculating...";
    }
    return timeEstimate;
  };

  const getLastUpdated = (datetime: string | Date) => {
    return formatDistanceToNow(new Date(datetime), { addSuffix: true });
  };

  const handleStatusUpdate = async (newStatus: DriverStatus) => {
    try {
      await updateDriverStatus(order.id, newStatus, orderType);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle>Driver Status</CardTitle>
        </CardHeader>
        <CardContent>
          {driverInfo ? (
            <>
              <div className="space-y-4 py-4 bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                <div className="flex flex-col items-center justify-center">
                  <span className="mb-2 text-xl font-medium text-slate-800">Driver Status</span>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                    <Badge
                      variant="outline"
                      className={cn("px-4 py-2 text-lg font-medium", getStatusColor(order.driverStatus))}
                    >
                      {getDisplayStatus(order.driverStatus)}
                    </Badge>
                    
                    {/* Show estimated delivery time */}
                    {getEstimatedTimeRemaining(order.driverStatus) && (
                      <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-700 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> 
                        {getEstimatedTimeRemaining(order.driverStatus)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Enhanced progress bar with timestamps */}
                <div className="relative">
                  <Progress
                    value={getProgressValue(order.driverStatus)}
                    className="w-full h-3 bg-slate-200"
                    indicatorClassName={cn("transition-all duration-500", {
                      "bg-yellow-400": order.driverStatus === DriverStatus.ASSIGNED,
                      "bg-blue-500": order.driverStatus === DriverStatus.ARRIVED_AT_VENDOR,
                      "bg-green-500": order.driverStatus === DriverStatus.EN_ROUTE_TO_CLIENT,
                      "bg-purple-500": order.driverStatus === DriverStatus.ARRIVED_TO_CLIENT,
                      "bg-slate-500": order.driverStatus === DriverStatus.COMPLETED,
                    })}
                  />
                  
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <div className="flex flex-col items-center">
                      <span>Assigned</span>
                      <span className="text-[10px]">{formatDateTime(order.pickupDateTime)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>At Vendor</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>En Route</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Arrived</span>
                      <span className="text-[10px]">{formatDateTime(order.arrivalDateTime)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>Completed</span>
                      <span className="text-[10px]">{formatDateTime(order.completeDateTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Status Button - Only show if editable */}
              {isEditable && (
                <div className="flex justify-center pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-slate-300 bg-white hover:bg-slate-50"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Status"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {Object.entries(driverStatusMap).map(([status, label]) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusUpdate(status as DriverStatus)}
                          className={cn(
                            "cursor-pointer",
                            status === order.driverStatus && "bg-slate-100 font-medium"
                          )}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <Truck className="h-14 w-14 mb-4 text-slate-300" />
              <p className="text-lg font-medium">No driver assigned to this order yet</p>
              <p className="text-sm mt-2 max-w-md text-center">A driver will be assigned soon. You'll be able to track their progress once they're on the way.</p>
              
              <div className="mt-6 flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Estimated assignment: within 30 minutes</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
} 