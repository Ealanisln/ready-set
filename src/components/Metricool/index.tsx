"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    beTracker?: {
      t: (config: { hash: string }) => void;
    };
  }
}

interface TrackingPreferences {
  analytics?: boolean;
  marketing?: boolean;
}

export default function MetricoolScript({ trackingHash }: { trackingHash: string }) {
  const [shouldLoadScript, setShouldLoadScript] = useState(false);

  useEffect(() => {
    try {
      const preferences: TrackingPreferences = JSON.parse(
        localStorage.getItem("cookiePreferences") || "{}"
      );
      
      setShouldLoadScript(!!preferences.analytics || !!preferences.marketing);
    } catch (error) {
      console.error("Error parsing cookie preferences:", error);
      setShouldLoadScript(false);
    }
  }, []);

  useEffect(() => {
    const initializeMetricool = () => {
      if (window.beTracker) {
        window.beTracker.t({ hash: trackingHash });
      }
    };

    if (shouldLoadScript) {
      window.addEventListener("load", initializeMetricool);
      return () => {
        window.removeEventListener("load", initializeMetricool);
      };
    }
  }, [shouldLoadScript, trackingHash]);

  return shouldLoadScript ? (
    <Script
      src="https://tracker.metricool.com/resources/be.js"
      strategy="afterInteractive"
      id="metricool-script"
    />
  ) : null;
}