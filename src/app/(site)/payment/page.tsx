// src/app/payment/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { PaymentSuccess } from "@/components/Payment/PaymentSuccess";
import { PaymentCanceled } from "@/components/Payment/PaymentCanceled";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const planName = searchParams.get("plan");

  if (status === "success") {
    return <PaymentSuccess planName={planName} />;
  }

  return <PaymentCanceled />;
}
