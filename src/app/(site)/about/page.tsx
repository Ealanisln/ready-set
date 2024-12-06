import About from "@/components/About";
import BusinessServices from "@/components/About/BusinessServices";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Ready Set Business Solutions",
  description: "Since 2019, Ready Set has delivered excellence through HIPAA-compliant, food safety certified services across San Francisco Bay Area and Austin. Our professional team specializes in same-day delivery, catering setup, and emergency courier services with a commitment to exceptional care and reliability.",
  keywords: [
    "Ready Set delivery",
    "San Francisco courier",
    "Austin delivery service",
    "HIPAA compliant delivery",
    "food handlers certified",
    "Bay Area catering delivery",
    "same day delivery service",
    "emergency courier service",
    "professional delivery team",
    "catering setup service",
    "Austin courier service",
    "Silicon Valley delivery",
    "food safety certified",
    "professional couriers",
    "event logistics",
    "business operations support",
    "trained delivery drivers",
    "Bay Area business services",
    "Austin business solutions",
    "California certified delivery"
  ],
  openGraph: {
    title: "About Ready Set | Professional Delivery Services in SF Bay Area & Austin",
    description: "Professional, certified delivery services with HIPAA compliance and Food Handler certification. Specializing in same-day delivery, catering setup, and emergency courier services across San Francisco Bay Area and Austin.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ready Set | SF Bay Area & Austin's Premier Delivery Service",
    description: "Discover how Ready Set delivers excellence with certified, professional courier services in San Francisco Bay Area and Austin. HIPAA compliant, Food Handler certified team.",
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
      url: "https://readysetgroup.com",
    }
  ],
  verification: {
    google: "add-your-google-verification-code",
  },
  category: "Business Services",
  classification: "Professional Delivery Services",
};

const AboutPage = () => {
  return (
    <main>
      <Breadcrumb pageName="Our Story"/>
      <About />
      <BusinessServices />
      <Team />
    </main>
  );
};

export default AboutPage;
