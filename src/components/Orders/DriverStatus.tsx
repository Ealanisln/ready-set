import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DriverStatusCardProps {
  order: {
    id: string;
    user_id: string;
    user_type: string;
    service_id: string;
    service_type: string;
    created_at: string | null;
    updated_at: string | null;
  };
}

interface DriverInfo {
  id: string;
  name: string | null;
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
            `Failed to fetch dispatch info: ${dispatchResponse.status} ${errorText}`
          );
        }

        const dispatchData = await dispatchResponse.json();
        console.log("Dispatch data:", dispatchData);

        if (dispatchData && dispatchData.driver_id) {
          console.log(
            "Fetching driver info for driver ID:",
            dispatchData.driver_id
          );
          const driverResponse = await fetch(
            `/api/users/${dispatchData.driver_id}`
          );
          console.log("Driver response status:", driverResponse.status);

          if (!driverResponse.ok) {
            const errorText = await driverResponse.text();
            console.error("Driver response error:", errorText);
            throw new Error(
              `Failed to fetch driver info: ${driverResponse.status} ${errorText}`
            );
          }

          const driverData = await driverResponse.json();
          console.log("Driver data:", driverData);

          setDriverInfo({
            id: dispatchData.driver_id,
            name: driverData.name,
          });
        } else {
          console.log("No driver assigned to this order");
          setDriverInfo(null);
          setNoDispatchFound(true);
        }
      } catch (error) {
        console.error("Error in fetchDriverInfo:", error);
        setError(
          error instanceof Error 
            ? error.message 
            : "An unknown error occurred"
        );
        if (error instanceof Error && error.message.includes("already assigned")) {
          setDriverInfo(null);  // Clear any existing driver info
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (order.id) {
      fetchDriverInfo();
    }
  }, [order.id]);

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
          <div>No dispatch found for this order. A driver has not been assigned yet.</div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Driver Name:{" "}
              <span className="font-medium">
                {driverInfo?.name || "Not assigned"}
              </span>
            </div>
            <div>
              Created At:{" "}
              <span className="font-medium">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "N/A"}
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