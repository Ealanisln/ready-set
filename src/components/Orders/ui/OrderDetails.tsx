import { Separator } from "@/components/ui/separator";
import { Order, isCateringRequest, isOnDemand } from "@/types/order";
import { formatCurrency, withCurrencySymbol } from "@/utils/currency";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold">Order Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {isCateringRequest(order) && (
            <>
              {order.headcount && (
                <div>
                  Headcount:{" "}
                  <span className="font-medium">{order.headcount}</span>
                </div>
              )}
              {order.needHost && (
                <div>
                  Need Host:{" "}
                  <span className="font-medium">{order.needHost}</span>
                </div>
              )}
              {order.numberOfHosts && (
                <div>
                  Number of Hosts:{" "}
                  <span className="font-medium">{order.numberOfHosts}</span>
                </div>
              )}
            </>
          )}
          {isOnDemand(order) && (
            <>
              {order.itemDelivered && (
                <div>
                  Item Delivered:{" "}
                  <span className="font-medium">{order.itemDelivered}</span>
                </div>
              )}
              {order.vehicleType && (
                <div>
                  Vehicle Type:{" "}
                  <span className="font-medium">{order.vehicleType}</span>
                </div>
              )}
              {order.length && order.width && order.height && (
                <div>
                  Dimensions:{" "}
                  <span className="font-medium">{`${order.length} x ${order.width} x ${order.height}`}</span>
                </div>
              )}
              {order.weight && (
                <div>
                  Weight: <span className="font-medium">{order.weight}</span>
                </div>
              )}
            </>
          )}
          {order.hoursNeeded && (
            <div>
              Hours Needed:{" "}
              <span className="font-medium">{order.hoursNeeded}</span>
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
        <div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div className="font-semibold">
              Total: {withCurrencySymbol(formatCurrency(order.orderTotal))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Tip: {withCurrencySymbol(formatCurrency(order.tip))}</div>
          </div>
        </div>
        {isCateringRequest(order) && order.brokerage && (
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