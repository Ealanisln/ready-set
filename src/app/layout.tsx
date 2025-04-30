// src/app/layout.tsx
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import ClientLayout from "@/components/Clients/ClientLayout";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import CookieConsentBanner from "../components/Cookies/Banner";
import { UserProvider } from "@/contexts/UserContext"; // Add this import
import { Toaster } from "@/components/ui/toaster";

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
        {/* Perception Company Analytics Script */}
        <Script
          id="perception-company-analytics"
          strategy="afterInteractive"
          src="https://www.perception-company.com/js/803213.js"
        />
        <noscript>
          <img
            src="https://www.perception-company.com/803213.png"
            style={{ display: "none" }}
            alt="analytics-pixel"
          />
        </noscript>
      </head>
      <body className="overflow-x-hidden">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <UserProvider> {/* Wrap everything in UserProvider */}
            <ClientLayout>{children}</ClientLayout>
          </UserProvider>
        </ErrorBoundary>
        <Toaster />
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