import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import ClientLayout from "@/components/Clients/ClientLayout";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import CookieConsentBanner from "../components/Cookies/Banner";
import { Metadata, Viewport } from 'next';

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// Exportación separada para el viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// URL base para los metadatos - usa variable de entorno o valor por defecto
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fvcmtjw0-3000.usw3.devtunnels.ms';

// Metadatos mejorados con metadataBase
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: 'Ready Set LLC',
    locale: 'en_US',
    type: 'website',
    // Eliminamos la referencia directa a /opengraph-image ya que Next.js lo maneja automáticamente
    // cuando se proporcionan los archivos correctos en el directorio de la app
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ready Set Virtual Assistant Services',
    description: 'Expert Virtual Assistants, Ready When You Are.',
    creator: '@ReadySetLLC',
    // Eliminamos la referencia directa a /twitter-image ya que Next.js lo maneja automáticamente
    // cuando se proporcionan los archivos correctos en el directorio de la app
  },
  other: {
    'fb:app_id': process.env.NEXT_PUBLIC_FB_APP_ID || '', // Usar variable de entorno
    'og:logo': `${siteUrl}/images/logo/logo-white.png`, // Agregada la etiqueta og:logo que faltaba
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
  keywords: 'virtual assistant, VA services, Ready Set LLC, administrative support, professional VA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`scroll-smooth ${montserrat.className}`}
      lang="en"
    >
      <head>
        {/* Solo mantener etiquetas que no son manejadas automáticamente por Next.js */}
        {process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION && (
          <meta 
            name="p:domain_verify" 
            content={process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION} 
          />
        )}
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