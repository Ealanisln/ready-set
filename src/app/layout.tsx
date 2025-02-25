// src/app/layout.tsx
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from "@/components/Clients/ClientLayout";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import CookieConsentBanner from "../components/Cookies/Banner";
import { Metadata } from 'next';

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// Updated metadata with your logo path
export const metadata: Metadata = {
  title: 'Ready Set Virtual Assistant Services | Beyond Traditional VA Support',
  description: 'Expert Virtual Assistants, Ready When You Are.',
  openGraph: {
    title: 'Ready Set Virtual Assistant Services | Beyond Traditional VA Support',
    description: 'Expert Virtual Assistants, Ready When You Are.',
    url: 'https://readysetllc.com',
    siteName: 'Ready Set LLC',
    images: [
      {
        url: '/images/logo/new-logo-ready-set.png', // Your logo path
        width: 1200,
        height: 630,
        alt: 'Ready Set LLC Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ready Set Virtual Assistant Services',
    description: 'Expert Virtual Assistants, Ready When You Are.',
    images: ['/images/logo/new-logo-ready-set.png'], // Your logo path
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning={true}
      className={`!scroll-smooth ${montserrat.className}`}
      lang="en"
    >
      <body className="overflow-x-hidden">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
        <Analytics />
        <CookieConsentBanner
          metricoolHash="5e4d77df771777117a249111f4fc9683"
          gaMeasurementId="G-PHGL28W4NP"
        />
      </body>
    </html>
  );
}