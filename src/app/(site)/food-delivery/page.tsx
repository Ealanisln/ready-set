// src/app/(site)/food/page.tsx
'use client';

import { Metadata } from 'next';
import { FormType } from '@/components/Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import CateringDelivery from '@/components/Food/CateringDelivery';
import DeliveryPartners from '@/components/Food/DeliveryPartners';
import FoodIcons from '@/components/Food/FoodIcons';
import DeliveryTerms from '@/components/Food/DeliveryTerms';
import HostingChecklist from '@/components/Food/HostingChecklist';
import MainMeal from '@/components/Food/MainMeal';

export default function FoodPage() {
  return (
    <div className="pt-20 md:pt-24">
      <CateringDelivery />
      <DeliveryPartners />
      <FoodIcons />
      <DeliveryTerms />
      <HostingChecklist />
      <MainMeal />
    </div>
  );
}
