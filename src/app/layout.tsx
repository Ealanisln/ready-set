// src/app/layout.tsx
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import ClientLayout from "@/components/Clients/ClientLayout";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import CookieConsentBanner from "../components/Cookies/Banner";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

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
      <head>
        {/* Umami Analytics Script (consent-free) */}
        <Script
          id="rs-tracker-app"
          strategy="afterInteractive"
          src="https://analytics-chi-wine.vercel.app/script.js"
          data-website-id="41e73d42-53bf-4b9a-ae31-2e2d22a02a32"
        />
      </head>
      <body className="overflow-x-hidden">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
        {/* {process.env.NODE_ENV === "development" && <VercelToolbar />} */}
        <Analytics />
        <CookieConsentBanner
          metricoolHash="5e4d77df771777117a249111f4fc9683"
          gaMeasurementId="G-PHGL28W4NP"
        />
      </body>
    </html>
  );
}
