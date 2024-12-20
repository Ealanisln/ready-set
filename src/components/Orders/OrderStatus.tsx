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
import { OrderStatus, OrderType } from '@/types/order';

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.active:
        return "bg-blue-500 hover:bg-blue-600";
      case OrderStatus.assigned:
        return "bg-yellow-500 hover:bg-yellow-600";
      case OrderStatus.cancelled:
        return "bg-red-500 hover:bg-red-600";
      case OrderStatus.completed:
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.active:
        return <Clock className="mr-1 h-4 w-4" />;
      case OrderStatus.assigned:
        return <Truck className="mr-1 h-4 w-4" />;
      case OrderStatus.cancelled:
        return <XCircle className="mr-1 h-4 w-4" />;
      case OrderStatus.completed:
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
  orderId: string | number;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

export const OrderStatusCard: React.FC<OrderStatusProps> = ({
  orderType,
  initialStatus,
  orderId,
  onStatusChange,
}) => {
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

  const getOrderTypeDisplay = (type: OrderType): string => {
    return type === "catering" ? "Catering Request" : "On-Demand Order";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {getOrderTypeDisplay(orderType)}
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
          <Select
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            value={status}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(OrderStatus).map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;