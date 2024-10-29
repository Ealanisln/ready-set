import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import BayAreaMap from "@/components/Contact/mapba";
import AustinMap from "@/components/Contact/mapaustin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Page | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is contact page description",
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
