// components/GoogleAnalytics.tsx
"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { useEffect } from "react";
import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  useEffect(() => {
    // This ensures GA is enabled when the component mounts if consent is given
    if (window) {
      window[`ga-disable-${measurementId}`] = false;
    }

    return () => {
      // Disable GA when component unmounts
      if (window) {
        window[`ga-disable-${measurementId}`] = true;
      }
    };
  }, [measurementId]);

  return (
    <>
      <NextGoogleAnalytics gaId={measurementId} />
      <Script
        id="perception-company-analytics"
        strategy="afterInteractive"
        src="https://www.perception-company.com/js/803213.js"
      />
      <noscript>
        <img 
          src="https://www.perception-company.com/803213.png" 
          style={{ display: 'none' }} 
          alt="analytics-pixel" 
        />
      </noscript>
    </>
  );
};

export default GoogleAnalytics;