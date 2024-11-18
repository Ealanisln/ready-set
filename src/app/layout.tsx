// src/app/layout.tsx
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
  return (
    <html
      suppressHydrationWarning={true}
      className={`!scroll-smooth ${montserrat.className}`}
      lang="en"
    >
      <body className="overflow-x-hidden">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ErrorBoundary>

        {process.env.NODE_ENV === "development" && <VercelToolbar />}
        <Analytics />
        <MetricoolScript />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-PHGL28W4NP" />
        <CookieConsentBanner />
      </body>
    </html>
  );
}