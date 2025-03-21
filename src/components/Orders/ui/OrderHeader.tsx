// src/components/Orders/ui/OrderHeader.tsx

import React, { useState } from "react";
import { MoreVertical, Truck, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Driver, OrderType } from "@/types/order";
import toast from "react-hot-toast";

interface OrderHeaderProps {
  orderNumber: string;
  date: string | Date | null; // Updated to allow null
  driverInfo: Driver | null;
  onAssignDriver: () => void;
  orderType: OrderType;
  orderId: string | number | bigint; // Updated to accept bigint
  onDeleteSuccess: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  orderNumber,
  date,
  driverInfo,
  onAssignDriver,
  orderType,
  orderId,
  onDeleteSuccess,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (date: string | Date | null): string => {
    if (!date) return "N/A";
    
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  const getApiOrderType = (type: OrderType): string => {
    return type === "on_demand" ? "onDemand" : type;
  };

  const handleDeleteOrder = async () => {
    try {
      const apiOrderType = getApiOrderType(orderType);
      const response = await fetch(
        `/api/orders/delete?orderId=${orderId.toString()}&orderType=${apiOrderType}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        toast.success("Order deleted successfully");
        onDeleteSuccess();
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">
            Order {orderNumber}
          </CardTitle>
          <CardDescription>Date: {formatDate(date)}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={onAssignDriver}
          >
            {driverInfo ? (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit Driver</span>
              </>
            ) : (
              <>
                <Truck className="h-4 w-4" />
                <span>Assign Driver</span>
              </>
            )}
          </Button>
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
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderHeader;