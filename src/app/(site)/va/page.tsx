import HeroHeader from "@/components/VirtualAssistant";
import DiscoveryCallSection from "@/components/VirtualAssistant/DiscoveryCall";
import DiscoveryBanner from "@/components/VirtualAssistant/DiscoveryCallBanner";
import OverwhelmSection from "@/components/VirtualAssistant/FeatureCard";

import Features from "@/components/VirtualAssistant/Features";
import Pricing from "@/components/VirtualAssistant/Pricing";
import BusinessScaleSection from "@/components/VirtualAssistant/VaOptimizationCta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Virtual Assistant Services | Ready Set",
  description:
    "Transform your business operations with Ready Set's comprehensive virtual assistant solutions. Beyond just VA staffing, we optimize processes, implement technology, and create scalable systems to help you save 20+ hours weekly and achieve true work-life balance.",
  keywords: [
    "virtual assistant services",
    "business optimization",
    "process automation",
    "business scaling",
    "VA solutions",
    "business efficiency",
    "time management",
    "workflow automation",
    "business productivity",
    "remote assistant",
    "administrative support",
    "business systemization",
    "work-life balance",
    "business growth",
    "task management",
    "process improvement",
    "business automation",
    "virtual team",
    "business transformation",
    "operational efficiency",
  ],
  openGraph: {
    title:
      "Ready Set Virtual Assistant Services | Beyond Traditional VA Support",
    description:
      "Discover how Ready Set's VA services combine skilled virtual assistants with process optimization and technology implementation to help you scale your business and reclaim 20+ hours per week.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready Set VA Services | Transform Your Business Operations",
    description:
      "More than just VA staffing - we help optimize your business processes, implement efficient systems, and create a scalable operation that runs smoothly without constant oversight.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [
    {
      name: "Ready Set Group LLC",
      url: "https://readysetllc.com",
    },
  ],
  category: "Business Services",
  classification: "Virtual Assistant and Business Optimization",
  other: {
    "service-type":
      "Virtual Assistant, Business Optimization, Process Automation",
    "business-stage": "Growth and Scaling",
    "target-audience": "Business Owners, Entrepreneurs, Growing Companies",
    "service-benefits":
      "Time Savings, Business Scaling, Work-Life Balance, Operational Efficiency",
  },
};

const AboutPage = () => {
  return (
    <main>
      {/* <ReadySetVirtualAssistantPage /> */}
      <HeroHeader />
      {/* <FeatureCarousel /> */}
      {/* <Features /> */}
      <OverwhelmSection />
      <DiscoveryCallSection />
      <BusinessScaleSection />
      {/* <Pricing /> */}
      <DiscoveryBanner />
    </main>
  );
};

export default AboutPage;
