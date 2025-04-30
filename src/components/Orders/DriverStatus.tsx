// src/components/Orders/DriverStatus.tsx

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
import { Clock, MapPin, Phone, Mail, Truck, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";

interface Driver {
  id: string;
  name?: string | null;
  email?: string | null;
  contact_number?: string | null;
}

interface DriverStatusCardProps {
  order: {
    id: string; // Updated to string per schema
    status: OrderStatus;
    driver_status?: DriverStatus | null;
    user_id: string;
    pickup_time?: string | Date | null;
    arrival_time?: string | Date | null;
    complete_time?: string | Date | null;
    updated_at: string | Date;
  };
  driverInfo: Driver | null;
  updateDriverStatus: (newStatus: DriverStatus) => Promise<void>;
  isEditable?: boolean; // New prop to control if status can be edited
}

// Update the status maps to use the enum with UPPERCASE keys
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

// Badge colors mapping for driver status
const driverStatusColors: Record<DriverStatus, string> = {
  [DriverStatus.ASSIGNED]: "border-yellow-300 bg-yellow-100 text-yellow-800",
  [DriverStatus.ARRIVED_AT_VENDOR]: "border-blue-300 bg-blue-100 text-blue-800",
  [DriverStatus.EN_ROUTE_TO_CLIENT]: "border-green-300 bg-green-100 text-green-800",
  [DriverStatus.ARRIVED_TO_CLIENT]: "border-purple-300 bg-purple-100 text-purple-800",
  [DriverStatus.COMPLETED]: "border-gray-300 bg-gray-100 text-gray-800",
};

export const DriverStatusCard: React.FC<DriverStatusCardProps> = ({
  order,
  driverInfo,
  updateDriverStatus,
  isEditable = true,
}) => {
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

  // Calculate estimated time for delivery (simple placeholder implementation)
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

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-5">
        {driverInfo ? (
          <div className="space-y-5">
            {/* Driver Info Section - With enhanced contact details */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold mb-3 text-slate-800">Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Driver Name:</span>
                  <span className="font-medium text-slate-900">
                    {driverInfo.name || "Not assigned"}
                  </span>
                </div>
                {driverInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <a href={`mailto:${driverInfo.email}`} className="font-medium text-blue-600 hover:underline">
                      {driverInfo.email}
                    </a>
                  </div>
                )}
                {driverInfo.contact_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <a href={`tel:${driverInfo.contact_number}`} className="font-medium text-blue-600 hover:underline">
                      {driverInfo.contact_number}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500">Last Updated:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="font-medium text-slate-600">
                          {getLastUpdated(order.updated_at)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDateTime(order.updated_at)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Status and Progress */}
            <div className="space-y-4 py-4 bg-white rounded-lg p-4 shadow-sm border border-slate-100">
              <div className="flex flex-col items-center justify-center">
                <span className="mb-2 text-xl font-medium text-slate-800">Driver Status</span>
                
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <Badge
                    variant="outline"
                    className={cn("px-4 py-2 text-lg font-medium", getStatusColor(order.driver_status))}
                  >
                    {getDisplayStatus(order.driver_status)}
                  </Badge>
                  
                  {/* Show estimated delivery time */}
                  {getEstimatedTimeRemaining(order.driver_status) && (
                    <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> 
                      {getEstimatedTimeRemaining(order.driver_status)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Enhanced progress bar with timestamps */}
              <div className="relative">
                <Progress
                  value={getProgressValue(order.driver_status)}
                  className="w-full h-3 bg-slate-200"
                  indicatorClassName={cn("transition-all duration-500", {
                    "bg-yellow-400": order.driver_status === DriverStatus.ASSIGNED,
                    "bg-blue-500": order.driver_status === DriverStatus.ARRIVED_AT_VENDOR,
                    "bg-green-500": order.driver_status === DriverStatus.EN_ROUTE_TO_CLIENT,
                    "bg-purple-500": order.driver_status === DriverStatus.ARRIVED_TO_CLIENT,
                    "bg-slate-500": order.driver_status === DriverStatus.COMPLETED,
                  })}
                />
                
                <div className="flex justify-between mt-1 text-xs text-slate-500">
                  <div className="flex flex-col items-center">
                    <span>Assigned</span>
                    <span className="text-[10px]">{formatDateTime(order.pickup_time)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>At Vendor</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>En Route</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>Arrived</span>
                    <span className="text-[10px]">{formatDateTime(order.arrival_time)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>Completed</span>
                    <span className="text-[10px]">{formatDateTime(order.complete_time)}</span>
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
                    >
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(driverStatusMap).map(([status, label]) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => updateDriverStatus(status as DriverStatus)}
                        className={cn(
                          "cursor-pointer",
                          status === order.driver_status && "bg-slate-100 font-medium"
                        )}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
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
  );
};