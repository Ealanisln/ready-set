"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ToasterContext from "@/app/api/contex/ToasetContex";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  const isBackendAdminRoute = pathname?.startsWith("/admin");
  const isStudioRoute = pathname?.startsWith("/studio");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <ToasterContext />
        {!isBackendAdminRoute && !isStudioRoute && <Header />}
        <main className="flex-grow">{children}</main>
        {!isBackendAdminRoute && !isStudioRoute && <Footer />}
        <ScrollToTop />
      </ThemeProvider>
    </SessionProvider>
  );
}