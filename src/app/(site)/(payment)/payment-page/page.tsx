"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Create a separate component for the payment content
function PaymentContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle the success and canceled status from URL parameters
  const status = searchParams.get("status");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 100,
          currency: "usd",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-40">
      <h1 className="mb-8 text-2xl font-bold">Complete Your Payment</h1>

      {status === "success" && (
        <Alert className="mb-8 bg-green-50">
          <AlertTitle>Payment Successful!</AlertTitle>
          <AlertDescription>
            Thank you for your payment. We&apos;ll process your order shortly.
          </AlertDescription>
        </Alert>
      )}

      {status === "canceled" && (
        <Alert className="mb-8 bg-yellow-50">
          <AlertTitle>Payment Canceled</AlertTitle>
          <AlertDescription>
            Your payment was canceled. Please try again if you wish to complete
            the purchase.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-8 bg-red-50">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
          <p className="text-gray-600">Total Amount: $100.00 USD</p>
        </div>

        <Button onClick={handleCheckout} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>
      </div>
    </div>
  );
}

// Main page component wrapped with Suspense
export default function PaymentPage() {
  return (
    <Suspense 
      fallback={
        <div className="container mx-auto max-w-2xl py-40">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}