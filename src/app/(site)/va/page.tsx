import Breadcrumb from "@/components/Common/Breadcrumb";
import VirtualAssistantServices from "@/components/VirtualAssistant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Ready Set | About Us",
  description: "This is About page description",
};

const AboutPage = () => {
  return (
    <main>
      
      <VirtualAssistantServices />
    </main>
  );
};

export default AboutPage;
