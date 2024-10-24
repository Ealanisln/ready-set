import Breadcrumb from "@/components/Common/Breadcrumb";
import Testimonials from "@/components/Testimonials";
import HeroHeader from "@/components/VirtualAssistant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ready Set | About Us",
  description: "This is About page description",
};

const AboutPage = () => {
  return (
    <main>
      <HeroHeader />
      <Testimonials />
    </main>
  );
};

export default AboutPage;
