import HeroHeader from "@/components/VirtualAssistant";
import DiscoveryCallSection from "@/components/VirtualAssistant/DiscoveryCall";
import DiscoveryBanner from "@/components/VirtualAssistant/DiscoveryCallBanner";
import OverwhelmSection from "@/components/VirtualAssistant/FeatureCard";
import FeatureCarousel from "@/components/VirtualAssistant/FeatureCarousel";
import Features from "@/components/VirtualAssistant/Features";
import Pricing from "@/components/VirtualAssistant/Pricing";
import BusinessScaleSection from "@/components/VirtualAssistant/VaOptimizationCta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ready Set | Virtual Assistant",
  description: "This is About page description",
};

const AboutPage = () => {
  return (
    <main>
      {/* <ReadySetVirtualAssistantPage /> */}
      <HeroHeader />
      <FeatureCarousel />

      {/* <FeatureCarousel /> */}
      <Features />
      <OverwhelmSection />
      <DiscoveryCallSection  />
      <BusinessScaleSection />
      <Pricing />
      <DiscoveryBanner />
    </main>
  );
};

export default AboutPage;
