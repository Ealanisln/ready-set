"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import menuData, {
  cateringRequestMenuItem,
  adminMenuItem,
  vendorMenuItem,
  driverMenuItem,
} from "./menuData";

// Define types
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

const Header: React.FC = () => {
  const { data: session } = useSession();
  const pathUrl = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const { theme, setTheme } = useTheme();

  // Check if current page is Virtual Assistant page
  const isVirtualAssistantPage = pathUrl === "/va";
  const isHomePage = pathUrl === "/";

  // Helper function for text colors throughout the header
  const getTextColorClasses = () => {
    if (sticky) {
      return "text-dark dark:text-white";
    }
    if (isVirtualAssistantPage || isHomePage) {
      return "text-white";
    }
    return "text-dark dark:text-white";
  };

  // Updated logo visibility logic
  const getLogoVisibility = () => {
    if (sticky) {
      return {
        light: "block dark:hidden",  // Show light logo in light mode
        dark: "hidden dark:block"    // Show dark logo in dark mode
      };
    }
    if (isVirtualAssistantPage || isHomePage) {
      return {
        light: "hidden",             // Hide light logo
        dark: "block"                // Show dark logo
      };
    }
    return {
      light: "block dark:hidden",    // Default: Show light logo in light mode
      dark: "hidden dark:block"      // Default: Show dark logo in dark mode
    };
  };

  const logoClasses = getLogoVisibility();

  const navbarToggleHandler = () => {
    setNavbarOpen((prev) => !prev);
  };

  const closeNavbarOnNavigate = () => {
    setNavbarOpen(false);
  };

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

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

  return (
<header
  className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
    sticky
      ? "shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[5px] dark:border-dark-3/20 dark:bg-dark/10"
      : isVirtualAssistantPage
      ? "absolute bg-transparent"  // Changed from bg-[#000000] to bg-transparent
      : "absolute bg-transparent"
  }`}
>
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link
              href="/"
              className={`navbar-logo block w-full ${
                sticky ? "py-2" : "py-5"
              } `}
            >
              {(!isHomePage || sticky) ? (
                <>
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="logo"
                    width={240}
                    height={30}
                    className={`header-logo w-full ${logoClasses.light}`}
                  />
                  <Image
                    src="/images/logo/logo-dark.png"
                    alt="logo"
                    width={240}
                    height={30}
                    className={`header-logo w-full ${logoClasses.dark}`}
                  />
                </>
              ) : (
                <>
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className={`header-logo w-full ${logoClasses.light}`}
                  />
                  <Image
                    src="/images/logo/logo-dark.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className={`header-logo w-full ${logoClasses.dark}`}
                  />
                </>
              )}
            </Link>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? " top-[7px] rotate-45" : " "
                  } ${
                    sticky
                      ? "bg-dark dark:bg-white"
                      : isVirtualAssistantPage || isHomePage
                        ? "bg-white"
                        : "bg-dark dark:bg-white"
                  }`}
                />
                {/* ... other spans with similar conditional styling */}
              </button>
              <nav
                id="navbarCollapse"
                className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${
                  navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                }`}
              >
                <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
                  {updatedMenuData.map((menuItem, index) => (
                    <li key={menuItem.id} className="group relative">
                      {menuItem.path ? (
                        <Link
                          onClick={closeNavbarOnNavigate}
                          scroll={false}
                          href={menuItem.path}
                          className={`ud-menu-scroll flex py-2 text-base ${getTextColorClasses()} group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              handleSubmenu(index);
                              closeNavbarOnNavigate();
                            }}
                            className={`ud-menu-scroll flex items-center justify-between py-2 text-base ${getTextColorClasses()} group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6`}
                          >
                            {menuItem.title}
                            <span className="pl-1">
                              <svg width="15" height="14" viewBox="0 0 15 14">
                                <path
                                  d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </button>
                          <div
                            className={`submenu relative left-0 top-full w-[250px] rounded-sm bg-white p-4 transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark-2 lg:invisible lg:absolute lg:top-[110%] lg:block lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                              openIndex === index ? "!-left-[25px]" : "hidden"
                            }`}
                          >
                            {menuItem.submenu?.map((submenuItem) => (
                              <Link
                                href={submenuItem.path || "#"}
                                key={submenuItem.id}
                                onClick={() => {
                                  handleSubmenu(index);
                                  navbarToggleHandler();
                                }}
                                className={`block rounded px-4 py-[10px] text-sm ${
                                  pathUrl === submenuItem.path
                                    ? "text-primary"
                                    : "text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
                                }`}
                              >
                                {submenuItem.title}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                  {!session?.user && (
                    <>
                      <li className="group relative lg:hidden">
                        <Link
                          onClick={closeNavbarOnNavigate}
                          scroll={false}
                          href="/signin"
                          className="ud-menu-scroll flex py-2 text-base text-white group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
                        >
                          Sign In
                        </Link>
                      </li>
                      <li className="group relative lg:hidden">
                        <Link
                          onClick={closeNavbarOnNavigate}
                          scroll={false}
                          href="/signup"
                          className="ud-menu-scroll flex py-2 text-white group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
                        >
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                  {session?.user && (
                    <li className="group relative lg:hidden">
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/", redirect: true });
                          navbarToggleHandler();
                        }}
                        className="ud-menu-scroll flex py-2 text-base text-white group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
                      >
                        Sign Out
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
            {/* Theme toggler */}
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

              {session?.user ? (
              <>
                <Link href={`/user/${session.user.id}`}>
                  <p
                    className={`loginBtn px-7 py-3 font-medium ${
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
                    className="signUpBtn rounded-lg bg-blue-800 bg-opacity-20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-white"
                  >
                    Sign Out
                  </button>
                                 ) : (
                                  <button
                                    onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                                    className="signUpBtn rounded-lg bg-blue-800 bg-opacity-100 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-20 hover:text-dark"
                                  >
                                    Sign Out
                                  </button>
                  )}
                </>
              ) : (
                <>
                  {pathUrl !== "/" || isVirtualAssistantPage ? (
                    <>
                      <Link
                        href="/signin"
                        className="px-7 py-3 text-base font-medium text-white hover:opacity-70 dark:text-white"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className={`px-7 py-3 text-base font-medium hover:opacity-70 ${
                          sticky
                            ? "text-black dark:text-white"
                            : "text-white dark:text-white"
                        }`}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className={`rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out ${
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
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
