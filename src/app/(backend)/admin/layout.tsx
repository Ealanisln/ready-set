"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Dashboard/Sidebar/app-sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
// import { CommandMenu } from "@/components/Dashboard/CommandMenu";
// import { TopNav } from "@/components/Dashboard/TopNav";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For client components we can't use the cookies() function directly
  // Using localStorage instead for persistent sidebar state
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar_state");
    if (savedState !== null) {
      setDefaultOpen(savedState === "true");
    }
    setIsLoaded(true);
  }, []);
  
  const handleSidebarChange = (isOpen: boolean) => {
    localStorage.setItem("sidebar_state", String(isOpen));
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-600" />
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleSidebarChange}>
          <div className="relative flex min-h-screen max-w-full overflow-hidden">
            <AppSidebar />
            {/* <CommandMenu /> */}
            <SidebarInset className="flex flex-col p-0 w-full">
              {/* <TopNav /> */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={Math.random()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex-1 w-full"
                  )}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </UserProvider>
    </ThemeProvider>
  );
}