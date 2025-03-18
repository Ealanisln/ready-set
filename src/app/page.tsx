import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero/index";
import NewsletterForm from '../components/Resources/ui/NewsLetterForm';
import { Metadata } from "next/types";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Ready Set | Catering Delivery & Virtual Assistant Services",
  description:
    "Since 2019, Ready Set has been the trusted delivery partner for Silicon Valley giants like Apple, Google, and Facebook. Offering specialized catering delivery and professional virtual assistant services across multiple industries.",
  keywords: [
    "catering delivery",
    "virtual assistant services",
    "Bay Area logistics",
    "Silicon Valley delivery",
    "corporate catering",
    "food safety certified",
    "business support",
    "same-day delivery",
    "San Francisco courier",
    "real estate VA",
    "restaurant management",
    "retail support",
    "education sector VA",
    "contractor staffing",
    "Ready Set VA",
    "floral delivery",
    "gift delivery",
    "administrative support",
    "order management",
    "Silicon Valley services",
  ],
  openGraph: {
    title:
      "Ready Set Group LLC | Bay Area's Premier Business Solutions Provider",
    description:
      "Established in 2019, Ready Set delivers excellence through specialized catering delivery and virtual assistant services. Trusted by tech giants like Apple, Google, and Facebook. Serving the Bay Area with certified logistics solutions.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Ready Set Group LLC | Catering Delivery & Virtual Assistant Services",
    description:
      "Silicon Valley's trusted delivery partner since 2019. Specialized in catering delivery and professional virtual assistant services for tech giants and businesses of all sizes.",
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
  category: "Business Services",
  classification: "Logistics and Professional Services",

};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
      <Testimonials />
      <div className="my-12"></div>
      <NewsletterForm />
    </main>
  );
}
