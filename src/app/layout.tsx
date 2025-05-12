// src/app/layout.tsx
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import ClientLayout from "@/components/Clients/ClientLayout";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import CookieConsentBanner from "../components/Cookies/Banner";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { HighlightInit } from '@highlight-run/next/client';
import { H } from 'highlight.run';
import { CONSTANTS } from '@/constants';
import { HighlightErrorBoundary } from '@/components/ErrorBoundary/HighlightErrorBoundary';

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// Expose Highlight globally for easier debugging
if (typeof window !== 'undefined') {
  window.H = H;
}

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
        
        {/* Directly include Highlight.js script for more reliable loading */}
        <Script id="highlight-init" strategy="beforeInteractive">
          {`
            window.HIGHLIGHT_DEBUG = true;
            window.HIGHLIGHT_PROJECT_ID = "${CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}";
          `}
        </Script>
      </head>
      <body className="overflow-x-hidden">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <UserProvider>
            <HighlightInit
              projectId={CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
              serviceName="ready-set-frontend"
              debug={true}
              networkRecording={{
                enabled: true,
                recordHeadersAndBody: true,
                urlBlocklist: [
                  // Add sensitive URLs here that shouldn't be recorded
                  "/api/auth",
                  "/api/login",
                ],
              }}
              tracingOrigins={[
                "localhost", 
                "readysetllc.com",
                "ready-set.vercel.app"
              ]}
            />
            <HighlightErrorBoundary>
              <ClientLayout>{children}</ClientLayout>
            </HighlightErrorBoundary>
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