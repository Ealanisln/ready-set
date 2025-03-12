// src/components/Analytics/LeadForensicsTracker.tsx
'use client'

import Script from 'next/script'

export default function LeadForensicsTracker() {
  return (
    <>
      <Script
        id="lead-forensics-script"
        src="https://www.perception-company.com/js/803213.js"
        strategy="afterInteractive"
        onError={(e) => console.error('Lead Forensics script failed to load', e)}
      />
      <noscript>
        <img 
          src="https://www.perception-company.com/803213.png" 
          style={{ display: 'none' }} 
          alt="Lead Forensics tracking pixel" 
        />
      </noscript>
    </>
  )
}