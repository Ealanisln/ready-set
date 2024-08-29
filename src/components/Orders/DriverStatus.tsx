import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

interface DriverStatusCardProps {
  order: {
    id: string;
    status: string;
    user_id: string;
    pickup_time: string;
    arrival_time: string;
    complete_time: string;
    updated_at: string | null;
  };
  driverInfo: Driver | null;
}

const DriverStatusCard: React.FC<DriverStatusCardProps> = ({
  order,
  driverInfo,
}) => {
  return (
    <Card className="mx-auto w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Driver Details</CardTitle>
      </CardHeader>
      <CardContent>
        {driverInfo ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Driver Name:{" "}
              <span className="font-medium">
                {driverInfo.name || "Not assigned"}
              </span>
            </div>
            <div>
              Driver Email:{" "}
              <span className="font-medium">{driverInfo.email || "N/A"}</span>
            </div>
            <div>
              Driver Contact:{" "}
              <span className="font-medium">
                {driverInfo.contact_number || "N/A"}
              </span>
            </div>
            <div>
              Updated At:{" "}
              <span className="font-medium">
                {order.updated_at
                  ? new Date(order.updated_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        ) : (
          <div>No driver assigned to this order.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverStatusCard;
