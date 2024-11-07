import { Metadata } from "next";
import LogisticsContent from "./LogisticsContent";

export const metadata: Metadata = {
  title: "Premium Catering Logistics Services | Ready Set",
  description:
    "Bay Area's Most Trusted Catering Delivery Partner Since 2019. Specialized delivery, time-critical service, and quality guaranteed for premium catering needs.",
  keywords:
    "catering logistics, food delivery service, Bay Area catering, premium food delivery, temperature controlled delivery",
  openGraph: {
    title: "Premium Catering Logistics Services | Ready Set",
    description: "Bay Area's Most Trusted Catering Delivery Partner Since 2019",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Catering Logistics Services | Ready Set",
    description: "Bay Area's Most Trusted Catering Delivery Partner Since 2019",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function LogisticsPage() {
  return <LogisticsContent />;
}