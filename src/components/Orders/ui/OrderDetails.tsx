// OrderDetails.tsx
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Order } from '@/types/order';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold">Order Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {order.order_type === "catering" && (
            <>
              {order.headcount && (
                <div>
                  Headcount: <span className="font-medium">{order.headcount}</span>
                </div>
              )}
              {order.need_host && (
                <div>
                  Need Host: <span className="font-medium">{order.need_host}</span>
                </div>
              )}
              {order.number_of_host && (
                <div>
                  Number of Hosts: <span className="font-medium">{order.number_of_host}</span>
                </div>
              )}
            </>
          )}
          {order.order_type === "on_demand" && (
            <>
              {order.item_delivered && (
                <div>
                  Item Delivered: <span className="font-medium">{order.item_delivered}</span>
                </div>
              )}
              {order.vehicle_type && (
                <div>
                  Vehicle Type: <span className="font-medium">{order.vehicle_type}</span>
                </div>
              )}
              {order.length && order.width && order.height && (
                <div>
                  Dimensions: <span className="font-medium">{order.length} x {order.width} x {order.height}</span>
                </div>
              )}
              {order.weight && (
                <div>
                  Weight: <span className="font-medium">{order.weight}</span>
                </div>
              )}
            </>
          )}
          {order.hours_needed && (
            <div>
              Hours Needed: <span className="font-medium">{order.hours_needed}</span>
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pb-4">
        <div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div className="font-semibold">
              Total: ${order.order_total}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Tip: ${order.tip}</div>
          </div>
        </div>
        {order.order_type === "catering" && order.brokerage && (
          <div>
            <h3 className="mb-2 font-semibold">Brokerage</h3>
            <div className="text-sm">{order.brokerage}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;