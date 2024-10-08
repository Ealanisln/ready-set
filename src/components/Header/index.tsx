"use client";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import menuData, {
  cateringRequestMenuItem,
  adminMenuItem,
  vendorMenuItem,
  driverMenuItem,
} from "./menuData";

// Define types
type UserType = 'client' | 'admin' | 'super_admin' | 'vendor' | 'driver' | undefined;

interface MenuItem {
  id: string | number;
  title: string;
  path?: string;
  newTab?: boolean;
  submenu?: MenuItem[];
}

const Header = () => {
  const { data: session } = useSession();
  const pathUrl = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const { theme, setTheme } = useTheme();

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
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
      (item) => item.title !== "Sign In" && item.title !== "Sign Up"
    ),
    ...(userType === "client" ? [cateringRequestMenuItem] : []),
    ...(userType === "admin" || userType === "super_admin" ? [adminMenuItem] : []),
    ...(userType === "vendor" ? [cateringRequestMenuItem] : []),
    ...(userType === "driver" ? [driverMenuItem] : []),
  ];

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
          <div className="w-60 max-w-full px-4">
            <Link
              href="/"
              className={`navbar-logo block w-full ${
                sticky ? "py-2" : "py-5"
              } `}
              onClick={navbarToggleHandler}
            >
              {pathUrl !== "/" ? (
                <>
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="logo"
                    width={240}
                    height={30}
                    className="header-logo w-full dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo-dark.png"
                    alt="logo"
                    width={240}
                    height={30}
                    className="header-logo hidden w-full dark:block"
                  />
                </>
              ) : (
                <>
                  <Image
                    src={sticky ? "/images/logo/logo-white.png" : "/images/logo/logo-white.png"}
                    alt="logo"
                    width={140}
                    height={30}
                    className="header-logo w-full dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo-dark.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="header-logo hidden w-full dark:block"
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
                {/* ... (hamburger menu spans) */}
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
                          onClick={navbarToggleHandler}
                          scroll={false}
                          href={menuItem.path}
                          className={`ud-menu-scroll flex py-2 text-base ${
                            pathUrl !== "/"
                              ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                              : sticky
                              ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                              : "text-body-color dark:text-white lg:text-white"
                          } ${pathUrl === menuItem.path && "text-primary"} lg:inline-flex lg:px-0 lg:py-6`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSubmenu(index)}
                            className={`ud-menu-scroll flex items-center justify-between py-2 text-base ${
                              pathUrl !== "/"
                                ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                                : sticky
                                ? "text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary"
                                : "text-body-color dark:text-white lg:text-white"
                            } lg:inline-flex lg:px-0 lg:py-6`}
                          >
                            {menuItem.title}
                            <span className="pl-1">
                              {/* ... (dropdown arrow svg) */}
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
                          onClick={navbarToggleHandler}
                          scroll={false}
                          href="/signin"
                          className="ud-menu-scroll flex py-2 text-base text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
                        >
                          Sign In
                        </Link>
                      </li>
                      <li className="group relative lg:hidden">
                        <Link
                          onClick={navbarToggleHandler}
                          scroll={false}
                          href="/signup"
                          className="ud-menu-scroll flex py-2 text-base text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
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
                        className="ud-menu-scroll flex py-2 text-base text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
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
                className="flex h-8 w-8 items-center justify-center duration-300"
              >
                {/* ... (theme toggle SVGs) */}
              </button>

              {session?.user ? (
                <>
                  <Link href={`/user/${session.user.id}`}>
                    <p
                      className={`loginBtn px-7 py-3 text-base font-medium ${
                        !sticky && pathUrl === "/"
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {session.user.name}
                    </p>
                  </Link>
                  {pathUrl !== "/" || sticky ? (
                    <button
                      onClick={() =>
                        signOut({ callbackUrl: "/", redirect: true })
                      }
                      className="signUpBtn rounded-lg bg-blue-800 bg-opacity-100 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-20 hover:text-dark"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        signOut({ callbackUrl: "/", redirect: true })
                      }
                      className="signUpBtn rounded-lg bg-blue-800 bg-opacity-20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-white"
                    >
                      Sign Out
                    </button>
                  )}
                </>
              ) : (
                <>
                  {pathUrl !== "/" ? (
                    <>
                      <Link
                        href="/signin"
                        className="px-7 py-3 text-base font-medium hover:opacity-70 dark:text-white"
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
                            : "text-black dark:text-white"
                        }`}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className={`rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out ${
                          sticky
                            ? "bg-primary hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
                            : "bg-white/10 hover:bg-white/20"
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