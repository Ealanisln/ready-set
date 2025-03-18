// components/Analytics/LeadForensics.tsx
import Script from 'next/script'

export default function LeadForensics() {
  return (
    <>
      <Script
        src="https://www.perception-company.com/js/803213.js"
        strategy="afterInteractive"
        type="text/javascript"
      />
      <noscript>
        <img 
          src="https://www.perception-company.com/803213.png" 
          style={{ display: 'none' }} 
          alt=""
        />
      </noscript>
    </>
  )
}