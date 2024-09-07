"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import CustomHead from "./custom-head";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  const isBackendAdminRoute = pathname?.startsWith("/admin");
  const isStudioRoute = pathname?.startsWith("/studio");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html
      suppressHydrationWarning={true}
      className={`!scroll-smooth ${montserrat.className}`}
      lang="en"
    >
      <head />
      <body>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
          >
            <NextSSRPlugin
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <ToasterContext />
            {!isBackendAdminRoute && !isStudioRoute && <Header />}
            <CustomHead />
            <main className="flex-grow">{children}</main>
            <Analytics />
            {!isBackendAdminRoute && !isStudioRoute && <Footer />}
            <ScrollToTop />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}