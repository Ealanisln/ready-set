// OrderHeader.tsx
import React from 'react';
import { MoreVertical, Truck, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Driver } from '@/types/order';

interface OrderHeaderProps {
  orderNumber: string;
  date: string;
  driverInfo: Driver | null;
  onAssignDriver: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ orderNumber, date, driverInfo, onAssignDriver }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div>
        <CardTitle className="text-2xl font-bold">
          Order {orderNumber}
        </CardTitle>
        <CardDescription>
          Date: {new Date(date).toLocaleDateString()}
        </CardDescription>
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
            <DropdownMenuItem>Trash</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
};

export default OrderHeader;