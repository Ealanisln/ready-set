import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Subscribe, Unsubscribe } from "@/components/Newsletter";
import Team from "@/components/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Ready Set | Newsletter",
  description: "This is About page description",
};

const AboutPage = () => {
  return (
    <main>
      <Breadcrumb pageName="Newsletter Page" />
      <Subscribe />
    </main>
  );
};

export default AboutPage;
