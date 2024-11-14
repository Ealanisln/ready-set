// app/payment/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PaymentPage() {
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
          amount: 100, // $100 USD
          currency: "usd",
          // Add any other required parameters
          // successUrl: `${window.location.origin}/payment?status=success`,
          // cancelUrl: `${window.location.origin}/payment?status=canceled`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
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
