import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import BayAreaMap from "@/components/Contact/mapbayarea";
import AustinMap from "@/components/Contact/mapaustintx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Page | Ready Set",
  description: "Always ready for you",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Contact Page" />
      <Contact />
      <BayAreaMap />
      <AustinMap />
    </>
  );
};

export default ContactPage;
