// src/app/(site)/flowers/page.tsx
'use client';

import { Metadata } from 'next';
import FlowerHero from '@/components/Flowers/FlowerHero';
import FlowerIcons from '@/components/Flowers/FlowerIcons';
import PackageDelivery from '@/components/Flowers/PackageDelivery';
import DeliveryWork from '@/components/Flowers/DeliveryWork';
import DelicateBlooms from '@/components/Flowers/DelicateBlooms';
// import DeliveryBanner from '@/components/Flowers/bannerdrivers'; // Commented out - file not found
import ExpertSupportSection from '@/components/Flowers/ExpertSupportSection';
import FAQSection from '@/components/Flowers/FAQSection';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import { FormType } from '@/components/Logistics/QuoteRequest/types';

export default function LogisticsPage() {
  const { openForm, DialogForm } = FormManager();

  const handleRequestQuote = (formType: FormType) => {
    console.log('LogisticsPage - handleRequestQuote called with:', formType);
    openForm(formType);
  };

  return (
    <div className="pt-16">
      <FlowerHero onRequestQuote={handleRequestQuote} />
      <FlowerIcons />
      <PackageDelivery onRequestQuote={handleRequestQuote} />
      <ExpertSupportSection />
      <DeliveryWork />
      <DelicateBlooms />
      <FAQSection />
      <div className="flex flex-col items-center justify-center py-16"></div>
      {DialogForm}
    </div>
  );
}
