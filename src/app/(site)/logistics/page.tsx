// src/app/(site)/logistics/page.tsx

import { Metadata } from "next";
import LogisticsHero from "@/components/Logistics/LogisticsHero";
import WhyChoose from "@/components/Logistics/WhyChoose";
import FoodServices from "@/components/Logistics/FoodServices";
import ImageCarousel from "@/components/Logistics/ImagesCarousel";
import FlowerDeliveryPage from "@/components/Logistics/FlowerDelivery";
import SpecialtyDelivery from "@/components/Logistics/SpecialtyDelivery";
import BakeryDeliverySection from "@/components/Logistics/BakeryDelivery";
import { ClientFormWrapper } from "@/components/Logistics/QuoteRequest/ClientFormWrapper";
import PromoPopup from "@/components/PopUpBanner/PromoPopup";

export const metadata: Metadata = {
  title: "Premium Catering Logistics Services | Ready Set Group LLC",
  description:
    "Bay Area's trusted catering delivery partner since 2019. Specialized in temperature-controlled deliveries, serving tech giants like Apple, Google, and Facebook. Professional handling with real-time tracking.",
  keywords: [
    "catering logistics",
    "food delivery service",
    "temperature controlled delivery",
    "Bay Area catering",
    "corporate catering delivery",
    "professional food transport",
    "Silicon Valley catering",
    "premium delivery service",
    "time-critical delivery",
    "specialized food logistics",
    "corporate event delivery",
    "same-day catering delivery",
    "food safety certified delivery",
    "professional catering transport",
    "Bay Area food logistics",
  ],
  openGraph: {
    title: "Premium Catering Logistics Services | Ready Set Group LLC",
    description:
      "Expert catering delivery services in the Bay Area. Temperature-controlled vehicles, professional handling, and real-time tracking for corporate events.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Catering Logistics Services | Ready Set Delivery",
    description:
      "Specialized catering logistics for Bay Area businesses. Trusted by tech giants for reliable, temperature-controlled delivery services.",
  },
};

export default function LogisticsPage() {

  return (
    <>
    <ClientFormWrapper>
      <PromoPopup />
      <LogisticsHero />
      <WhyChoose />
      <ImageCarousel />
      <FoodServices />
      <FlowerDeliveryPage />
      <BakeryDeliverySection />
      <SpecialtyDelivery />
    </ClientFormWrapper>
    </>
  );
}
