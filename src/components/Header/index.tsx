// src/components/Header/index.tsx

"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { SupabaseClient } from "@supabase/supabase-js";
import { MenuItem } from "@/types/menu";
import { UserType } from "@/types/user";
import MobileMenu from "./MobileMenu";

// Define base menu items (visible to all users)
const baseMenuItems: MenuItem[] = [
  {
    id: 101,
    title: "Home",
    path: "/",
  },
  {
    id: 102,
    title: "About",
    path: "/about",
  },
  {
    id: 103,
    title: "RS Subsidiaries",
    submenu: [
      { id: 1031, title: "Logistics", path: "/logistics" },
      { id: 1032, title: "Virtual Assistant", path: "/va" },
      { id: 1033, title: "Join Us", path: "/join-the-team" },
    ],
  },
  {
    id: 104,
    title: "Flowers",
    path: "/flowers",
  },
  {
    id: 105,
    title: "Contact",
    path: "/contact",
  },
  {
    id: 106,
    title: "Blog",
    path: "/blog",
  },
  {
    id: 107,
    title: "Resources",
    path: "/resources",
  },
];

// Map user roles to their specific menu items
const ROLE_MENU_ITEMS: Record<UserType, MenuItem> = {
  [UserType.VENDOR]: {
    id: 5,
    title: "Vendor Dashboard",
    path: "/vendor",
  },
  [UserType.CLIENT]: {
    id: 6,
    title: "Client Dashboard",
    path: "/client",
  },
  [UserType.DRIVER]: {
    id: 3,
    title: "Driver Dashboard",
    path: "/driver",
  },
  [UserType.ADMIN]: {
    id: 1,
    title: "Admin Dashboard",
    path: "/admin",
  },
  [UserType.HELPDESK]: {
    id: 4,
    title: "Helpdesk",
    path: "/helpdesk",
  },
  [UserType.SUPER_ADMIN]: {
    id: 2,
    title: "Super Admin",
    path: "/admin",
  },
};

interface LogoProps {
  isHomePage: boolean;
  sticky: boolean;
  isVirtualAssistantPage: boolean;
}

const Logo: React.FC<LogoProps> = ({ isHomePage, sticky, isVirtualAssistantPage }) => {
  if (isVirtualAssistantPage) {
    return (
      <Link href="/" className={`navbar-logo block w-full ${sticky ? "py-3" : "py-6"}`}>
        {sticky ? (
          <picture>
            <source srcSet="/images/virtual/logo-headset.webp" type="image/webp" />
            <Image 
              src="/images/virtual/logo-headset.png" 
              alt="Virtual Assistant Logo" 
              width={180} 
              height={40} 
              className="header-logo w-full" 
              priority 
            />
          </picture>
        ) : (
          <picture>
            <source srcSet="/images/virtual/logo-headset-dark.webp" type="image/webp" />
            <Image 
              src="/images/virtual/logo-headset-dark.png" 
              alt="Virtual Assistant Logo" 
              width={180} 
              height={40} 
              className="header-logo w-full" 
              priority 
            />
          </picture>
        )}
      </Link>
    );
  }

  const logoClasses = {
    light: sticky || !isHomePage ? "block dark:hidden" : "hidden dark:block",
    dark: sticky || !isHomePage ? "hidden dark:block" : "block dark:hidden"
  };

  return (
    <Link href="/" className={`navbar-logo block w-full ${sticky ? "py-3" : "py-6"}`}>
      {!isHomePage || sticky ? (
        <>
          <Image 
            src="/images/logo/logo-white.png" 
            alt="logo" 
            width={280} 
            height={40} 
            className={`header-logo w-full ${logoClasses.light}`} 
          />
          <Image 
            src="/images/logo/logo-dark.png" 
            alt="logo" 
            width={280} 
            height={40} 
            className={`header-logo w-full ${logoClasses.dark}`} 
          />
        </>
      ) : (
        <>
          <Image 
            src="/images/logo/logo-white.png" 
            alt="logo" 
            width={180} 
            height={40} 
            className={`header-logo w-full ${logoClasses.light}`} 
          />
          <Image 
            src="/images/logo/logo-dark.png" 
            alt="logo" 
            width={180} 
            height={40} 
            className={`header-logo w-full ${logoClasses.dark}`} 
          />
        </>
      )}
    </Link>
  );
};

// Main Header Component
const Header: React.FC = () => {
  const router = useRouter();
  const pathUrl = usePathname() || "/";
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number>(-1);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  
  // Use the UserContext for authentication state
  const { user, userRole, isLoading } = useUser();
  
  const isVirtualAssistantPage = pathUrl === "/va";
  const isHomePage = pathUrl === "/";

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await createClient();
      setSupabaseClient(client);
    };
    initSupabase();
  }, []);

  // Toggle mobile menu
  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };
  
  // Handle submenu clicks
  const handleSubmenu = (index: number) => {
    setActiveSubmenu(index === activeSubmenu ? -1 : index);
  };

  // Close mobile menu on navigation
  const closeNavbar = () => {
    setNavbarOpen(false);
    setActiveSubmenu(-1);
  };

  // Handle sticky behavior
  const handleStickyNavbar = () => {
    setSticky(window.scrollY >= 80);
  };
  
  // Effect to close menu on route change
  useEffect(() => {
    closeNavbar();
  }, [pathUrl]);
  
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    if (!supabaseClient) return;
    
    setIsSigningOut(true);
    try {
      await supabaseClient.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
      setNavbarOpen(false);
    }
  };

  // Get role-specific menu item
  const roleMenuItem = userRole ? ROLE_MENU_ITEMS[userRole] : null;
  
  // Use base menu items without adding role-specific item (it will be shown separately)
  const menuItems = baseMenuItems;

  return (
    <header
      className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
        sticky
          ? "shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[5px] dark:border-dark-3/20 dark:bg-dark/10"
          : "absolute bg-transparent"
      }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-72 max-w-full px-4">
            <Logo
              isHomePage={isHomePage}
              sticky={sticky}
              isVirtualAssistantPage={isVirtualAssistantPage}
            />
          </div>

          <div className="flex w-full items-center justify-between">
            <MobileMenu
              navbarOpen={navbarOpen}
              menuData={menuItems}
              openIndex={activeSubmenu}
              handleSubmenu={handleSubmenu}
              closeNavbarOnNavigate={closeNavbar}
              navbarToggleHandler={toggleNavbar}
              pathUrl={pathUrl}
              sticky={sticky}
            />

            {/* Auth Buttons (only visible on desktop; mobile handled by MobileMenu) */}
            <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
              {!user && !isLoading ? (
                <>
                  {pathUrl !== "/" || isVirtualAssistantPage ? (
                    <div className="flex items-center gap-3">
                      <Link
                        href="/sign-in"
                        className={`hidden rounded-lg px-7 py-3 text-base font-semibold transition-all duration-300 lg:block
                          ${sticky 
                            ? "bg-white/90 text-dark shadow-md hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            : isVirtualAssistantPage 
                              ? "bg-white/90 text-dark shadow-md hover:bg-white"
                              : "bg-white/90 text-dark shadow-md hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                          }
                        `}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        className="hidden rounded-lg bg-amber-400 px-6 py-3 text-base font-medium text-black duration-300 ease-in-out hover:bg-amber-500 dark:bg-white/10 dark:hover:bg-white/20 lg:block"
                      >
                        Sign Up
                      </Link>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        className={`hidden rounded-lg px-7 py-3 text-base font-semibold transition-all duration-300 md:block 
                          ${sticky 
                            ? "bg-white/90 text-dark shadow-md hover:bg-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            : "bg-white/90 text-dark shadow-md hover:bg-white"
                          }
                        `}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        className={`hidden rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out md:block ${
                          sticky
                            ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              ) : user ? (
                <>
                  {roleMenuItem && roleMenuItem.path && (
                    <Link href={roleMenuItem.path}>
                      <p className={`loginBtn hidden px-7 py-3 font-medium lg:block ${
                        sticky
                          ? "text-dark dark:text-white"
                          : isVirtualAssistantPage || isHomePage
                            ? "text-white"
                            : "text-dark dark:text-white"
                      }`}>
                        {roleMenuItem.title}
                      </p>
                    </Link>
                  )}
                  {isVirtualAssistantPage || isHomePage ? (
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="signUpBtn hidden rounded-lg bg-blue-800 bg-opacity-20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-white md:block"
                    >
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </button>
                  ) : (
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="signUpBtn hidden rounded-lg bg-blue-800 bg-opacity-100 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-20 hover:text-dark md:block"
                    >
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </button>
                  )}
                </>
              ) : null}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleNavbar}
              id="navbarToggler"
              aria-label="Mobile Menu"
              className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
            >
              {[1, 2, 3].map((_, index) => (
                <span
                  key={index}
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen
                      ? index === 1
                        ? "opacity-0"
                        : index === 0
                          ? "top-[7px] rotate-45"
                          : "top-[-8px] -rotate-45"
                      : index === 1
                        ? "opacity-100"
                        : ""
                  } ${sticky ? "bg-dark dark:bg-white" : isVirtualAssistantPage || isHomePage ? "bg-white" : "bg-dark dark:bg-white"}`}
                />
              ))}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;