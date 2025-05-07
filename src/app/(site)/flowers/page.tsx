// src/app/(site)/logistics/page.tsx
import { Metadata } from 'next';
import FlowerHero from '@/components/Flowers/floweranimated';
import FlowerIcons from '@/components/Flowers/flowericons';
import PackageDelivery from '@/components/Flowers/packagedelivery';
import DeliveryWork from '@/components/Flowers/deliverywork';
import DelicateBlooms from '@/components/Flowers/delicateblooms';
import DeliveryBanner from '@/components/Flowers/bannerdrivers';
import ExpertSupportSection from '@/components/Flowers/ExpertSupportSection';
import FAQSection from '@/components/Flowers/FAQSection';
import { ClientFormWrapper } from '@/components/Logistics/QuoteRequest/ClientFormWrapper';

export default function LogisticsPage() {
  return (
    <div className="pt-16">
      <FlowerHero />
      <FlowerIcons />
      <ClientFormWrapper>
        <PackageDelivery />
      </ClientFormWrapper>
      <ExpertSupportSection />
      <DeliveryWork />
      <DelicateBlooms />
      <FAQSection />
      <div className="flex flex-col items-center justify-center py-16"></div>
    </div>
  );
}
