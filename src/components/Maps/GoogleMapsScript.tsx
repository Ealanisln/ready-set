// src/components/Maps/GoogleMapsScript.tsx
"use client";

import Script from "next/script";

export function GoogleMapsScript() {
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      strategy="lazyOnload"
      onError={() => console.error('Google Maps failed to load')}
      onLoad={() => console.log('Google Maps loaded successfully')}
    />
  );
}