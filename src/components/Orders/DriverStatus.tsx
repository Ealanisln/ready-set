import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DriverStatusCardProps {
  order: {
    id: string;
    status: string;
    user_id: string;
    pickup_time: string;
    arrival_time: string;
    complete_time: string;
    updated_at: string | null;
    dispatch: {
      driver: {
        id: string;
        name: string | null;
        email: string | null;
        contact_number: string | null;
      };
    }[];
  };
}

interface DriverInfo {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

const DriverStatusCard: React.FC<DriverStatusCardProps> = ({ order }) => {
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noDispatchFound, setNoDispatchFound] = useState(false);

  useEffect(() => {
    const fetchDriverInfo = async () => {
      setIsLoading(true);
      setError(null);
      setNoDispatchFound(false);
      try {
        console.log("Fetching dispatch info for order ID:", order.id);
        const dispatchResponse = await fetch(`/api/dispatch/${order.id}`);
        console.log("Dispatch response status:", dispatchResponse.status);

        if (dispatchResponse.status === 404) {
          console.log("No dispatch found for this order");
          setNoDispatchFound(true);
          return;
        }

        if (!dispatchResponse.ok) {
          const errorText = await dispatchResponse.text();
          console.error("Dispatch response error:", errorText);
          throw new Error(
            `Failed to fetch dispatch info: ${dispatchResponse.status} ${errorText}`,
          );
        }

        const dispatchData = await dispatchResponse.json();
        console.log("Dispatch data:", dispatchData);

        if (dispatchData && dispatchData.driver) {
          setDriverInfo({
            id: dispatchData.driver.id,
            name: dispatchData.driver.name,
            email: dispatchData.driver.email,
            contact_number: dispatchData.driver.contact_number,
          });
          
          console.log("Set driver info:", {
            id: dispatchData.driver.id,
            name: dispatchData.driver.name,
            email: dispatchData.driver.email,
            contact_number: dispatchData.driver.contact_number,
          });
        } else {
          console.log("No driver assigned to this order");
          setDriverInfo(null);
          setNoDispatchFound(true);
        }
      } catch (error) {
        console.error("Error in fetchDriverInfo:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (order.id) {
      fetchDriverInfo();
    }
  }, [order.id]);

  console.log("Current driverInfo state:", driverInfo);

  return (
    <Card className="mx-auto w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Driver Details</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading driver information...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : noDispatchFound ? (
          <div>
            No dispatch found for this order. A driver has not been assigned
            yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Driver Name:{" "}
              <span className="font-medium">
                {driverInfo?.name || "Not assigned"}
              </span>
            </div>
            <div>
              Driver Email:{" "}
              <span className="font-medium">{driverInfo?.email || "N/A"}</span>
            </div>
            <div>
              Driver Contact:{" "}
              <span className="font-medium">
                {driverInfo?.contact_number || "N/A"}
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
        )}
      </CardContent>
    </Card>
  );
};

export default DriverStatusCard;