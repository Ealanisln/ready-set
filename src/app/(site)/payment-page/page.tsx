// app/payment/page.tsx
'use client';

import { useEffect, useState } from 'react';
import PaymentForm from '@/components/Payments/PaymentForm';

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string>();

  useEffect(() => {
    // Create PaymentIntent when the page loads
    fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100, // $100 USD
        currency: 'usd',
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-40">
      <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
      <PaymentForm clientSecret={clientSecret} />
    </div>
  );
}