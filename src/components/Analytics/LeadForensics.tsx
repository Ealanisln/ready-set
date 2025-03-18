import Script from 'next/script';

export default function MyPage() {
  return (
    <>
      {/* Preload the script */}
      <link rel="preload" href="https://www.perception-company.com/js/803213.js" as="script" />

      {/* Load and execute the script */}
      <Script
        src="https://www.perception-company.com/js/803213.js"
        strategy="afterInteractive" // Ensures it runs after hydration
      />
      <h1>My Next.js Page</h1>
    </>
  );
}
