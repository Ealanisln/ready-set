import Breadcrumb from "@/components/Common/Breadcrumb";
import Testimonials from "@/components/Testimonials";
import HeroHeader from "@/components/VirtualAssistant";
import OverwhelmSection from "@/components/VirtualAssistant/FeatureCard";
import Features from "@/components/VirtualAssistant/Features";
import BusinessScaleSection from "@/components/VirtualAssistant/VaOptimizationCta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ready Set | Virtual Assistant",
  description: "This is About page description",
};

const AboutPage = () => {
  return (
    <main>
      <HeroHeader />
      <Features />
      <OverwhelmSection />
      <BusinessScaleSection />
      <Testimonials />
    </main>
  );
};

export default AboutPage;
