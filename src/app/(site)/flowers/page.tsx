import FlowerHero from '@/components/FlowersDelivery/FlowerHero';
import ServiceFeaturesSection from '@/components/FlowersDelivery/ServiceFeaturesSection';
import DeliveryTermsAndPricing from '@/components/FlowersDelivery/DeliveryTermsAndPricing';
import { Metadata } from 'next';
import ExpertSupportSection from '@/components/FlowersDelivery/ExpertSupportSection';
import ServiceProcessCarousel from '@/components/FlowersDelivery/ServiceProcessCarousel';
import FAQSection from '@/components/FlowersDelivery/FAQSection';
import DelicateBlooms from '@/components/FlowersDelivery/DelicateBlooms';

export const metadata: Metadata = {
  title: 'Floral Delivery Logistics for Flower Shops | Ready Set',
  description:
    "Ready Set provides reliable floral delivery and logistics services for flower shops in the Bay Area, San Francisco, Atlanta & Austin. We specialize in on-time, careful handling of bouquets, bulk orders, and offer real-time tracking to uphold your shop's standards.",
  keywords: [
    'floral delivery service',
    'flower shop delivery partner',
    'bulk flower delivery',
    'local floral logistics',
    'outsourced flower delivery',
    'delivery for florists',
    'B2B flower delivery',
    'San Francisco flower delivery',
    'Atlanta floral logistics',
    'Austin flower delivery service',
    'Bay Area floral delivery',
    'on-time flower delivery',
    'real-time floral tracking',
    'flower delivery solutions',
    'dedicated floral driver',
    'flower order fulfillment',
    'floral delivery logistics',
    'flower transport service',
  ],
  openGraph: {
    title: 'Expert Floral Delivery & Logistics Partner | Ready Set',
    description:
      'Partner with Ready Set for specialized floral delivery services. We help flower shops in SF, Atlanta, Austin & beyond ensure timely, beautiful deliveries, carrying your standards with every bouquet.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ready Set Group LLC',
    // Add an image URL relevant to your floral delivery service
    // images: [
    //   {
    //     url: "https://yourwebsite.com/images/floral-delivery-og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Ready Set Floral Delivery Service Vehicle",
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ready Set: Reliable Delivery for Your Flower Shop',
    description:
      "Ensure your flowers arrive perfectly. Ready Set offers specialized logistics and delivery for florists, focusing on care, timeliness, and your shop's reputation.",
    // Add your Twitter handle if you have one
    // site: "@YourTwitterHandle",
    // creator: "@YourTwitterHandle",
    // Add an image URL relevant to your floral delivery service
    // images: ["https://yourwebsite.com/images/floral-delivery-twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1, // Or a specific number if preferred
    },
  },
  authors: [
    {
      name: 'Ready Set Group LLC',
      url: 'https://readysetllc.com', // Replace with your actual domain
    },
  ],
  category: 'Business Services', // Or "Logistics and Transportation"
  classification: 'Floral Delivery Logistics for Businesses',
  other: {
    'service-type':
      'Floral Delivery, Flower Shop Logistics, Local Flower Delivery, Bulk Order Delivery',
    'target-audience': 'Flower Shops, Florists, Floral Designers, Event Planners',
    'service-locations': 'San Francisco, Bay Area, Atlanta, Austin', // List key service areas
    'service-benefits':
      'Reliable Delivery, On-Time Service, Careful Handling, Real-Time Tracking, Dedicated Drivers, Upholding Shop Reputation, Efficient Logistics',
  },
  alternates: {
    canonical: 'https://readysetllc.com/flowers', // Replace with the actual URL of this page
  },
};

const FlowersPage = () => {
  return (
    <main>
      <FlowerHero />
      <ServiceFeaturesSection />
      <DeliveryTermsAndPricing />
      <ExpertSupportSection />
      <ServiceProcessCarousel />
      <DelicateBlooms />
      <FAQSection />
    </main>
  );
};

export default FlowersPage;
