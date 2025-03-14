import Script from 'next/script';

export default function Head() {
  return (
    <>
      <title>
        Ready Set | Always ready
      </title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="On-demand courier that specializes in delivery for all your needs. We are Food Safety, and HIPPA Certified. Our team can meet all your Bay Area delivery needs." />
      <link rel="icon" href="/images/favicon.ico" />
      <meta name="robots" content="index, follow"/>
      
      {/* Perception Company Analytics Script */}
      <Script
        id="perception-company-analytics"
        strategy="afterInteractive"
        src="https://www.perception-company.com/js/803213.js"
      />
      <noscript>
        <meta
          name="perception-company-noscript"
          content="https://www.perception-company.com/803213.png"
        />
      </noscript>
    </>
  );
}