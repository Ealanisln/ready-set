// src/app/layout.tsx
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from "@/components/Clients/ClientLayout";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import CookieConsentBanner from "../components/Cookies/Banner";
import { Metadata } from 'next';

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// Metadatos mejorados para Open Graph y redes sociales
export const metadata: Metadata = {
  title: 'Ready Set Virtual Assistant Services | Beyond Traditional VA Support',
  description: 'Expert Virtual Assistants, Ready When You Are.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/logo/new-logo-ready-set.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Ready Set Virtual Assistant Services | Beyond Traditional VA Support',
    description: 'Expert Virtual Assistants, Ready When You Are.',
    url: 'https://readysetllc.com',
    siteName: 'Ready Set LLC',
    images: [
      {
        url: 'https://readysetllc.com/images/logo/new-logo-ready-set.png',
        width: 1200,
        height: 630,
        alt: 'Ready Set LLC Logo - Penguin',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ready Set Virtual Assistant Services',
    description: 'Expert Virtual Assistants, Ready When You Are.',
    creator: '@ReadySetLLC',
    images: [
      {
        url: 'https://readysetllc.com/images/logo/new-logo-ready-set.png',
        alt: 'Ready Set LLC Penguin Logo',
        width: 1200,
        height: 630,
      }
    ],
  },
  // Metadatos adicionales para otras plataformas
  other: {
    'fb:app_id': '', // Si tienes un ID de aplicación de Facebook
    'og:image:secure_url': 'https://readysetllc.com/images/logo/new-logo-ready-set.png',
  },
  applicationName: 'Ready Set LLC',
  appleWebApp: {
    title: 'Ready Set LLC',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  keywords: 'virtual assistant, VA services, Ready Set LLC, administrative support, professional VA',
};

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
      <head>
        {/* Etiquetas adicionales de verificación de Pinterest si las necesitas */}
        <meta name="p:domain_verify" content="" />
      </head>
      <body className="overflow-x-hidden">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
        <Analytics />
        <CookieConsentBanner
          metricoolHash="5e4d77df771777117a249111f4fc9683"
          gaMeasurementId="G-PHGL28W4NP"
        />
      </body>
    </html>
  );
}