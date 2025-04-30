"use client";

import { useState, useEffect } from "react";
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
      case OrderStatus.ACTIVE:
        return "bg-blue-500 hover:bg-blue-600";
      case OrderStatus.ASSIGNED:
        return "bg-yellow-500 hover:bg-yellow-600";
      case OrderStatus.CANCELLED:
        return "bg-red-500 hover:bg-red-600";
      case OrderStatus.COMPLETED:
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.ACTIVE:
        return <Clock className="mr-1 h-4 w-4" />;
      case OrderStatus.ASSIGNED:
        return <Truck className="mr-1 h-4 w-4" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="mr-1 h-4 w-4" />;
      case OrderStatus.COMPLETED:
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
  order_type: OrderType;
  initialStatus: OrderStatus;
  orderId: string | number | bigint;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

export const OrderStatusCard: React.FC<OrderStatusProps> = ({
  order_type,
  initialStatus,
  orderId,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    toast({
      title: "Status Updated",
      description: `Order ${orderId.toString()} status changed to ${newStatus}`,
    });
  };

  const getOrderTypeDisplay = (type: OrderType): string => {
    return type === "catering" ? "Catering Request" : "On-Demand Order";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {getOrderTypeDisplay(order_type)}
        </CardTitle>
        <CardDescription>Order ID: {orderId.toString()}</CardDescription>
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
                  {statusValue.charAt(0).toUpperCase() + statusValue.slice(1).toLowerCase()}
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