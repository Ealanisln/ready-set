import Breadcrumb from "@/components/Common/Breadcrumb";
import Testimonials from "@/components/Testimonials";
import VirtualAssistantServices from "@/components/VirtualAssistant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ready Set | About Us",
  description: "This is About page description",
};

const AboutPage = () => {
  return (
    <main>
      <VirtualAssistantServices />
      {/* <Testimonials /> */}
    </main>
  );
};

export default AboutPage;
