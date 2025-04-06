// src/components/Orders/ui/OrderHeader.tsx

import React, { useState } from "react";
import { 
  MoreVertical, 
  Truck, 
  Edit, 
  Trash2, 
  Calendar, 
  Download, 
  Printer, 
  RefreshCw,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Driver, OrderType } from "@/types/order";
import toast from "react-hot-toast";

interface OrderHeaderProps {
  orderNumber: string;
  date: string | Date | null; 
  driverInfo: Driver | null;
  onAssignDriver: () => void;
  order_type: OrderType;
  orderId: string | number | bigint;
  onDeleteSuccess: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  orderNumber,
  date,
  driverInfo,
  onAssignDriver,
  order_type,
  orderId,
  onDeleteSuccess,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatDate = (date: string | Date | null): string => {
    if (!date) return "N/A";
    
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getApiOrderType = (type: OrderType): string => {
    return type === "on_demand" ? "onDemand" : type;
  };

  const handleDeleteOrder = async () => {
    try {
      const apiOrderType = getApiOrderType(order_type);
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

  const handleRefreshOrder = async () => {
    setIsRefreshing(true);
    try {
      // This is a placeholder - you would implement the actual refresh logic
      await new Promise(resolve => setTimeout(resolve, 800)); 
      toast.success("Order refreshed successfully");
    } catch (error) {
      console.error("Error refreshing order data:", error);
      toast.error("Failed to refresh order data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-12 w-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 items-center justify-center text-white font-bold text-lg">
            {order_type === "catering" ? "CR" : "OD"}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Order {orderNumber}
            </h2>
            <div className="flex items-center text-slate-500 mt-1">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span className="text-sm">
                {formatDate(date)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleRefreshOrder}
                  disabled={isRefreshing}
                  className="text-slate-600 hover:text-amber-600 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh Order Data</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Order Data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-slate-600 hover:text-amber-600 border-slate-200 hover:border-amber-200 transition-colors hidden md:flex"
            onClick={onAssignDriver}
          >
            {driverInfo ? (
              <>
                <Edit className="h-4 w-4" />
                <span>Update Driver</span>
              </>
            ) : (
              <>
                <Truck className="h-4 w-4" />
                <span>Assign Driver</span>
              </>
            )}
          </Button>
          
          <Button
            size="icon"
            variant="outline" 
            className="md:hidden"
            onClick={onAssignDriver}
          >
            {driverInfo ? <Edit className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="outline"
                className="text-slate-600 hover:text-amber-600 border-slate-200 hover:border-amber-200 transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Order</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Print Order</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Change Status</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Order</span>
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
            <AlertDialogTitle>Delete Order: {orderNumber}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order and all associated data including driver assignments and files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteOrder}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderHeader;