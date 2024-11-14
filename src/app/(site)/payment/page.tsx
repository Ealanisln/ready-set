"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentSuccess } from "@/components/Payment/PaymentSuccess";
import { PaymentCanceled } from "@/components/Payment/PaymentCanceled";
import { Loader2 } from "lucide-react"; // Assuming you're using lucide-react for icons

// Separate component for the payment status content
function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const planName = searchParams.get("plan");

  if (status === "success") {
    return <PaymentSuccess planName={planName} />;
  }

  return <PaymentCanceled />;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

// Main page component
export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentStatusContent />
    </Suspense>
  );
}