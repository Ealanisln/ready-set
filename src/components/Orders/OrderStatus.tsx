"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Clock, XCircle, Truck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type CateringRequestStatus = "active" | "assigned" | "cancelled" | "completed";
type OnDemandStatus = "active" | "assigned" | "cancelled" | "completed";
type OrderStatus = CateringRequestStatus | OnDemandStatus;

type OrderType = "catering" | "on_demand";

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "active":
        return "bg-blue-500 hover:bg-blue-600";
      case "assigned":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "active":
        return <Clock className="mr-1 h-4 w-4" />;
      case "assigned":
        return <Truck className="mr-1 h-4 w-4" />;
      case "cancelled":
        return <XCircle className="mr-1 h-4 w-4" />;
      case "completed":
        return <CheckCircle className="mr-1 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Badge
      className={`${getStatusColor(status)} flex items-center capitalize text-white`}
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
};

interface OrderStatusProps {
  orderType: OrderType;
  initialStatus: OrderStatus;
  orderId: string;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

export default function OrderStatus({
  orderType,
  initialStatus,
  orderId,
  onStatusChange,
}: OrderStatusProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    toast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {orderType === "catering" ? "Catering Request" : "On-Demand Order"}
        </CardTitle>
        <CardDescription>Order ID: {orderId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">Current Status:</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Change Status:</span>
          <Select onValueChange={handleStatusChange} value={status}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
