'use client'

import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from "@/components/Clients/ClientLayout";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { VercelToolbar } from "@vercel/toolbar/next";
import MetricoolScript from "@/components/Metricool";
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import CookieConsentBanner from "@/components/Clients/banner";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldInjectToolbar = process.env.NODE_ENV === "development";

  return (
    <html
      suppressHydrationWarning={true}
      className={`!scroll-smooth ${montserrat.className}`}
      lang="en"
    >
      <body>
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>

        {/* Vercel Tools */}
        {shouldInjectToolbar && <VercelToolbar />}
        <Analytics />
        <MetricoolScript />
        <SpeedInsights />
        <CookieConsentBanner />
        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-PHGL28W4NP" />
      </body>
    </html>
  );
}