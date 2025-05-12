// src/app/(site)/food/page.tsx
'use client';

import { Metadata } from 'next';
import { FormType } from '@/components/Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import CateringDelivery from '@/components/Food/CateringDelivery';

export default function FoodPage() {
  return (
    <div className="pt-16 md:pt-20">
      <CateringDelivery />
    </div>
  );
}
