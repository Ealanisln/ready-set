// src/app/(site)/food/page.tsx
'use client';

import { Metadata } from 'next';
import { FormType } from '@/components/Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import CateringDelivery from '@/components/Food/CateringDelivery';
import DeliveryPartners from '@/components/Food/DeliveryPartners';
import FoodIcons from '@/components/Food/FoodIcons';

export default function FoodPage() {
  return (
    <div className="pt-16 md:pt-20">
      <CateringDelivery />
      <DeliveryPartners />
      <FoodIcons />
    </div>
  );
}
