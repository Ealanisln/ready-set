"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import menuData, {
  cateringRequestMenuItem,
  adminMenuItem,
  vendorMenuItem,
  driverMenuItem,
} from "./menuData";
import MobileMenu from "./MobileMenu";

// Types
type UserType =
  | "client"
  | "admin"
  | "super_admin"
  | "vendor"
  | "driver"
  | undefined;

interface MenuItem {
  id: string | number;
  title: string;
  path?: string;
  newTab?: boolean;
  submenu?: MenuItem[];
}

interface ThemeToggleButtonProps {
  getTextColorClasses: () => string;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  sticky: boolean;
  pathUrl: string;
  isVirtualAssistantPage: boolean;
}

interface LogoProps {
  isHomePage: boolean;
  sticky: boolean;
  logoClasses: {
    light: string;
    dark: string;
  };
}

interface AuthButtonsProps {
  session: Session | null;
  pathUrl: string;
  sticky: boolean;
  isVirtualAssistantPage: boolean;
  isHomePage: boolean;
}

// Components
const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  getTextColorClasses,
  theme,
  setTheme,
  sticky,
  pathUrl,
  isVirtualAssistantPage,
}) => (
  <button
    aria-label="theme toggler"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className={`flex h-8 w-8 items-center justify-center duration-300 ${getTextColorClasses()}`}
  >
    <svg
      viewBox="0 0 16 16"
      className="hidden h-[22px] w-[22px] dark:block"
      fill="currentColor"
    >
      <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z" />
    </svg>
    <svg
      viewBox="0 0 23 23"
      className={`h-[30px] w-[30px] fill-black text-dark dark:hidden ${
        (!sticky && pathUrl === "/") || isVirtualAssistantPage
          ? "text-white"
          : ""
      }`}
      fill="currentColor"
    >
      <g clipPath="url(#clip0_40_125)">
        <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
      </g>
    </svg>
  </button>
);

const Logo: React.FC<LogoProps> = ({ isHomePage, sticky, logoClasses }) => (
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

const AuthButtons: React.FC<AuthButtonsProps> = ({
  session,
  pathUrl,
  sticky,
  isVirtualAssistantPage,
  isHomePage,
}) => {
  if (session?.user) {
    return (
      <>
        <Link href={`/user/${session.user.id}`}>
          <p
            className={`loginBtn hidden px-7 py-3 font-medium lg:block ${
              sticky
                ? "text-dark dark:text-white"
                : isVirtualAssistantPage || isHomePage
                  ? "text-white"
                  : "text-dark dark:text-white"
            }`}
          >
            {session.user.name}
          </p>
        </Link>
        {isVirtualAssistantPage || isHomePage ? (
          <button
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            className="signUpBtn hidden rounded-lg bg-blue-800 bg-opacity-20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-white md:block"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            className="signUpBtn hidden rounded-lg bg-blue-800 bg-opacity-100 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-20 hover:text-dark md:block"
          >
            Sign Out
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {pathUrl !== "/" || isVirtualAssistantPage ? (
        <>
          <Link
            href="/signin"
            className="hidden px-7 py-3 text-base font-medium text-white hover:opacity-70 dark:text-white lg:block"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden rounded-lg bg-amber-400 px-6 py-3 text-base font-medium text-black duration-300 ease-in-out hover:bg-amber-500 dark:bg-white/10 dark:hover:bg-white/20 lg:block"
          >
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/signin"
            className={`hidden px-7 py-3 text-base font-medium hover:opacity-70 md:block ${
              sticky
                ? "text-black dark:text-white"
                : "text-white dark:text-white"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
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

const Header: React.FC = () => {
  const { data: session } = useSession();
  const pathUrl = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const { theme, setTheme } = useTheme();

  const isVirtualAssistantPage = pathUrl === "/va";
  const isHomePage = pathUrl === "/";

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
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Menu data processing
  const userType = session?.user?.type as UserType;
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
              session={session}
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
              {/* <ThemeToggleButton
                getTextColorClasses={getTextColorClasses}
                theme={theme}
                setTheme={setTheme}
                sticky={sticky}
                pathUrl={pathUrl}
                isVirtualAssistantPage={isVirtualAssistantPage}
              /> */}

              <AuthButtons
                session={session}
                pathUrl={pathUrl}
                sticky={sticky}
                isVirtualAssistantPage={isVirtualAssistantPage}
                isHomePage={isHomePage}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
