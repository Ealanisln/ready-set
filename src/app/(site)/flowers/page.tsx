// src/app/(site)/flowers/page.tsx
'use client';

// Direct imports using lowercase filenames for better case-sensitivity compatibility
import FlowerHero from '@/components/Flowers/FlowerHero';
import FlowerIcons from '@/components/Flowers/FlowerIcons';
import PackageDelivery from '@/components/Flowers/PackageDelivery';
import DeliveryWork from '@/components/Flowers/DeliveryWork';
import DelicateBlooms from '@/components/Flowers/DelicateBlooms';
import ExpertSupportSection from '@/components/Flowers/ExpertSupportSection';
import FAQSection from '@/components/Flowers/FAQSection';

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
