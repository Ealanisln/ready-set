// app/components/MetricoolScript.tsx
"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    beTracker?: {
      t: (config: { hash: string }) => void;
    };
  }
}

export default function MetricoolScript() {
  useEffect(() => {
    // Initialize Metricool after the script loads
    const initializeMetricool = () => {
      if (window.beTracker) {
        window.beTracker.t({ hash: "5e4d77df771777117a249111f4fc9683" });
      }
    };

    // Add event listener for script load
    window.addEventListener("load", initializeMetricool);

    return () => {
      window.removeEventListener("load", initializeMetricool);
    };
  }, []);

  return (
    <Script
      src="https://tracker.metricool.com/resources/be.js"
      strategy="afterInteractive"
      id="metricool-script"
    />
  );
}
