// components/GoogleAnalytics.tsx
"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { useEffect } from "react";

declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean;
  }
}

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
    </>
  );
};

export default GoogleAnalytics;
