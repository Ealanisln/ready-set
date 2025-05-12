// src/app/(site)/flowers/page.tsx
'use client';

// Import components with correct casing for compatibility
import FlowerHero from '@/components/Flowers/flowerhero';
import FlowerIcons from '@/components/Flowers/flowericons';
import PackageDelivery from '@/components/Flowers/packagedelivery';
import DeliveryWork from '@/components/Flowers/deliverywork';
import DelicateBlooms from '@/components/Flowers/delicateblooms';
import ExpertSupportSection from '@/components/Flowers/expertsupportsection';
import FAQSection from '@/components/Flowers/faqsection';

export default function FlowersPage() {

  return (
    <div className="pt-16">
      <FlowerHero  />
      <FlowerIcons />
      <PackageDelivery />
      <ExpertSupportSection />
      <DeliveryWork />
      <DelicateBlooms />
      <FAQSection />
    </div>
  );
}
