// src/app/(site)/flowers/page.tsx
'use client';

import {
  FlowerHero,
  FlowerIcons,
  PackageDelivery,
  DeliveryWork,
  DelicateBlooms,
  ExpertSupportSection,
  FAQSection
} from '@/components/Flowers';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import { FormType } from '@/components/Logistics/QuoteRequest/types';

export default function FlowersPage() {
  const { openForm, DialogForm } = FormManager();

  const handleRequestQuote = (formType: FormType) => {
    console.log('FlowersPage - handleRequestQuote called with:', formType);
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
