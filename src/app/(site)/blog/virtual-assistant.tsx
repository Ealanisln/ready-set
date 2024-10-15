import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "   Virtual Assistant Page | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is virtual assistant page description",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Virtual Assistant Page" />
      <Contact />
    </>
  );
};

export default ContactPage;