import { useState } from "react";
import { DriverStatus } from "@prisma/client";
import { toast } from "sonner";

type OrderType = "catering" | "ondemand";

interface UseDriverStatusOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for updating driver status for both catering and on-demand orders
 */
export function useDriverStatus(options?: UseDriverStatusOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateDriverStatus = async (
    orderId: string,
    status: DriverStatus,
    orderType: OrderType = "catering"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/driver/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          orderId, 
          status,
          orderType 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update driver status");
      }

      const data = await response.json();
      
      toast.success(`Order status updated to ${status}`);
      
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error("An unknown error occurred");
      
      setError(error);
      toast.error(error.message);
      
      if (options?.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateDriverStatus,
    isLoading,
    error,
  };
} 