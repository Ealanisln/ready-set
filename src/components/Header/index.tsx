"use client";

import React, { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import menuData, {
  cateringRequestMenuItem,
  adminMenuItem,
  vendorMenuItem,
  driverMenuItem,
} from "./menuData";
import MobileMenu from "./MobileMenu";
import toast from "react-hot-toast";

// Types
type UserType = "client" | "admin" | "super_admin" | "vendor" | "driver" | undefined;

interface MenuItem {
  id: string | number;
  title: string;
  path?: string;
  newTab?: boolean;
  submenu?: MenuItem[];
}

interface User {
  id: string;
  name?: string;
  type?: UserType;
}

interface LogoProps {
  isHomePage: boolean;
  sticky: boolean;
  logoClasses: {
    light: string;
    dark: string;
  };
  isVirtualAssistantPage: boolean;
}

interface AuthButtonsProps {
  user: User | null;
  pathUrl: string;
  sticky: boolean;
  isVirtualAssistantPage: boolean;
  isHomePage: boolean;
  onSignOut: () => Promise<void>;
  isSigningOut: boolean;
}

// Logo Component
const Logo: React.FC<LogoProps> = ({ isHomePage, sticky, logoClasses, isVirtualAssistantPage }) => {
  if (isVirtualAssistantPage) {
    return (
      <Link
        href="/"
        className={`navbar-logo block w-full ${sticky ? "py-3" : "py-6"}`}
      >
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

  return (
    <Link
      href="/"
      className={`navbar-logo block w-full ${sticky ? "py-3" : "py-6"}`}
    >
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

// Auth Buttons Component
const AuthButtons: React.FC<AuthButtonsProps> = ({
  user,
  pathUrl,
  sticky,
  isVirtualAssistantPage,
  isHomePage,
  onSignOut,
  isSigningOut
}) => {
  if (user) {
    return (
      <>
        <Link href={`/user/${user.id}`}>
          <p
            className={`loginBtn hidden px-7 py-3 font-medium lg:block ${
              sticky
                ? "text-dark dark:text-white"
                : isVirtualAssistantPage || isHomePage
                  ? "text-white"
                  : "text-dark dark:text-white"
            }`}
          >
            {user.name}
          </p>
        </Link>
        {isVirtualAssistantPage || isHomePage ? (
          <button
            onClick={onSignOut}
            disabled={isSigningOut}
            className="signUpBtn hidden rounded-lg bg-blue-800 bg-opacity-20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-white md:block"
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        ) : (
          <button
            onClick={onSignOut}
            disabled={isSigningOut}
            className="signUpBtn hidden rounded-lg bg-blue-800 bg-opacity-100 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-20 hover:text-dark md:block"
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        )}
      </>
    );
  }

  return (
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
  );
};

// Main Header Component
const Header: React.FC = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathUrl = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [user, setUser] = useState<User | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isVirtualAssistantPage = pathUrl === "/va";
  const isHomePage = pathUrl === "/";

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }
      if (supabaseUser) {
        // Fetch additional user data from your profiles table
        const { data: profile } = await supabase
          .from('users') // Change this if your table is called 'profiles'
          .select('name, type')
          .eq('id', supabaseUser.id)
          .single();

        setUser({
          id: supabaseUser.id,
          name: profile?.name || supabaseUser.email?.split('@')[0],
          type: profile?.type as UserType,
        });
      } else {
        setUser(null);
      }
    };

    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users') // Change this if your table is called 'profiles'
          .select('name, type')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          name: profile?.name || session.user.email?.split('@')[0],
          type: profile?.type as UserType,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        toast.error("Failed to sign out. Please try again.");
      } else {
        toast.success("Signed out successfully");
        router.push('/');
        router.refresh(); // Refresh to update auth state across the app
      }
    } catch (error: any) {
      console.error('Error in sign out process:', error);
      toast.error(error.message || "An error occurred while signing out");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Utility functions
  const getTextColorClasses = () => {
    if (sticky) return "text-dark dark:text-white";
    if (isVirtualAssistantPage || isHomePage) return "text-white";
    return "text-dark dark:text-white";
  };

  const getLogoVisibility = () => {
    if (sticky) {
      return {
        light: "block dark:hidden",
        dark: "hidden dark:block",
      };
    }
    if (isVirtualAssistantPage || isHomePage) {
      return {
        light: "hidden",
        dark: "block",
      };
    }
    return {
      light: "block dark:hidden",
      dark: "hidden dark:block",
    };
  };

  const getToggleBarColor = () => {
    if (sticky) return "bg-dark dark:bg-white";
    if (isVirtualAssistantPage || isHomePage) return "bg-white";
    return "bg-dark dark:bg-white";
  };

  // Event handlers
  const navbarToggleHandler = () => setNavbarOpen((prev) => !prev);
  const closeNavbarOnNavigate = () => setNavbarOpen(false);
  const handleSubmenu = (index: number) =>
    setOpenIndex(openIndex === index ? -1 : index);

  const handleStickyNavbar = () => {
    setSticky(window.scrollY >= 80);
  };

  useEffect(() => {
    closeAllMenus();
  }, [pathUrl]);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Close all menus
  const closeAllMenus = () => {
    setNavbarOpen(false);
    setOpenIndex(-1);
  };

  // Menu data processing
  const userType = user?.type as UserType;
  const updatedMenuData: MenuItem[] = [
    ...menuData.filter(
      (item) => item.title !== "Sign In" && item.title !== "Sign Up",
    ),
    ...(userType === "client" ? [cateringRequestMenuItem] : []),
    ...(userType === "admin" || userType === "super_admin"
      ? [adminMenuItem]
      : []),
    ...(userType === "vendor" ? [vendorMenuItem] : []),
    ...(userType === "driver" ? [driverMenuItem] : []),
  ];

  const logoClasses = getLogoVisibility();

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
              logoClasses={logoClasses}
              isVirtualAssistantPage={isVirtualAssistantPage}
            />
          </div>

          <div className="flex w-full items-center justify-between">
            <MobileMenu
              navbarOpen={navbarOpen}
              menuData={updatedMenuData}
              openIndex={openIndex}
              handleSubmenu={handleSubmenu}
              closeNavbarOnNavigate={closeNavbarOnNavigate}
              navbarToggleHandler={navbarToggleHandler}
              user={user}
              pathUrl={pathUrl}
              getTextColorClasses={getTextColorClasses}
            />

            {/* Mobile menu toggle button */}
            <button
              onClick={navbarToggleHandler}
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
                  } ${getToggleBarColor()}`}
                />
              ))}
            </button>

            {/* Desktop controls */}
            <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
              <AuthButtons
                user={user}
                pathUrl={pathUrl}
                sticky={sticky}
                isVirtualAssistantPage={isVirtualAssistantPage}
                isHomePage={isHomePage}
                onSignOut={handleSignOut}
                isSigningOut={isSigningOut}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;