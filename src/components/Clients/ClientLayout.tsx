// src/components/Clients/ClientLayout.tsx

"use client";

import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header/index";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ToasterContext from "@/app/api/contex/ToastContext";
import toast from "react-hot-toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  const isBackendAdminRoute = pathname?.startsWith("/admin");
  const isStudioRoute = pathname?.startsWith("/studio");
  const isHomePage = pathname === "/";

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <ToasterContext />
        {!isBackendAdminRoute && !isStudioRoute && !isHomePage && <Header />}
        <main className="flex-grow">{children}</main>
        {!isBackendAdminRoute && !isStudioRoute && <Footer />}
        <ScrollToTop />
      </ThemeProvider>
  );
}