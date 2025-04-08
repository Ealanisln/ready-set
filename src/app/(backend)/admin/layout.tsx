"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"; // Ensure path is correct
import { AppSidebar } from "@/components/Dashboard/Sidebar/app-sidebar"; // Ensure path is correct
import { UserProvider } from "@/contexts/UserContext"; // Ensure path is correct
import { ThemeProvider } from "@/components/ui/theme-provider"; // Ensure path is correct
// import { CommandMenu } from "@/components/Dashboard/CommandMenu";
// import { TopNav } from "@/components/Dashboard/TopNav";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Ensure path is correct
import { usePathname } from 'next/navigation'; // Import usePathname for unique keys

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname(); // Get pathname for a stable animation key

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar_state");
    // Ensure we only parse if the value exists and is 'true' or 'false'
    if (savedState === "true" || savedState === "false") {
      setDefaultOpen(savedState === "true");
    }
    setIsLoaded(true);
  }, []);

  const handleSidebarChange = (isOpen: boolean) => {
    localStorage.setItem("sidebar_state", String(isOpen));
  };

  // Loading state remains the same
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-600" /> {/* Adjusted color */}
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
        <SidebarProvider
          defaultOpen={defaultOpen}
          onOpenChange={handleSidebarChange}
        >
          {/* Main Flex Container */}
          <div className="flex min-h-svh w-full bg-slate-50">
            <AppSidebar />
            {/* <CommandMenu /> */}

            {/* SidebarInset: Added flex-1 to make it grow horizontally */}
            {/* Removed w-full as flex-1 handles width in flex row */}
            <SidebarInset className="flex flex-1 flex-col p-0"> 
              {/* <TopNav /> */}

              {/* Main content area: flex-1 for vertical expansion, overflow for scrolling */}
              <main className="flex flex-1 flex-col overflow-auto"> {/* Added flex flex-col */}
                <AnimatePresence mode="wait">
                  {/* Use pathname for a stable key during route transitions */}
                  <motion.div
                    key={pathname} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    // Removed flex-1 from here, main handles expansion
                    // Keep w-full if needed, but flex-col parent should manage width
                    className={cn("w-full")} 
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
              
            </SidebarInset>
          </div>
        </SidebarProvider>
      </UserProvider>
    </ThemeProvider>
  );
}