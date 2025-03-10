"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import Header from "@/components/Header/index";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ToasterContext from "@/app/api/contex/ToasetContex";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    // Solo acceder a window después del montaje, evitando errores durante SSR
    setPathname(window.location.pathname);
  }, []);

  const isBackendAdminRoute = pathname ? pathname.startsWith("/admin") : false;
  const isStudioRoute = pathname ? pathname.startsWith("/studio") : false;
  const isHomePage = pathname === "/";

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    setMounted(true);
  }, []);

  // No renderizar con ThemeProvider hasta que esté montado
  if (!mounted) {
    return (
      <SessionProvider>
        <ToasterContext />
        {!isBackendAdminRoute && !isStudioRoute && !isHomePage && <Header />}
        <main className="flex-grow">{children}</main>
        {!isBackendAdminRoute && !isStudioRoute && <Footer />}
        <ScrollToTop />
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <ToasterContext />
        {!isBackendAdminRoute && !isStudioRoute && !isHomePage && <Header />}
        <main className="flex-grow">{children}</main>
        {!isBackendAdminRoute && !isStudioRoute && <Footer />}
        <ScrollToTop />
      </ThemeProvider>
    </SessionProvider>
  );
}