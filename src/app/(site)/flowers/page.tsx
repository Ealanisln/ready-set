// src/app/(site)/flowers/page.tsx
'use client';

// Direct imports using lowercase filenames for better case-sensitivity compatibility
import FlowerHero from '@/components/Flowers/flowerhero';
import FlowerIcons from '@/components/Flowers/flowericons';
import PackageDelivery from '@/components/Flowers/packagedelivery';
import DeliveryWork from '@/components/Flowers/deliverywork';
import DelicateBlooms from '@/components/Flowers/delicateblooms';
import ExpertSupportSection from '@/components/Flowers/expertsupportsection';
import FAQSection from '@/components/Flowers/faqsection';
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
