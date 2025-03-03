// Navigation.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface MenuItem {
  title: string;
  path?: string;
  submenu?: MenuItem[];
}

interface NavigationProps {
  navbarOpen: boolean;
  navbarToggleHandler: () => void;
  pathUrl: string;
  sticky: boolean;
  menuData: MenuItem[];
}

const Navigation: React.FC<NavigationProps> = ({
  navbarOpen,
  navbarToggleHandler,
  pathUrl,
  sticky,
  menuData,
}) => {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get the current user when component mounts
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
    navbarToggleHandler();
  };

  return (
    <nav
      id="navbarCollapse"
      className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${
        navbarOpen
          ? "visibility top-full opacity-100"
          : "invisible top-[120%] opacity-0"
      }`}
    >
      <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
        {menuData.map((menuItem, index) => (
          <li key={index} className="group relative">
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
                      : "text-body-color dark:text-white lg:text-black"
                } ${pathUrl === menuItem?.path && (sticky || pathUrl !== "/") && "!text-primary"} lg:inline-flex lg:px-0 lg:py-6`}
              >
                {menuItem.title}
              </Link>
            ) : (
              <SubmenuButton
                menuItem={menuItem}
                index={index}
                openIndex={openIndex}
                handleSubmenu={handleSubmenu}
                pathUrl={pathUrl}
                sticky={sticky}
                navbarToggleHandler={navbarToggleHandler}
              />
            )}
          </li>
        ))}
        {!user && (
          <>
            <AuthLink
              href="/signin"
              title="Sign In"
              navbarToggleHandler={navbarToggleHandler}
            />
            <AuthLink
              href="/signup"
              title="Sign Up"
              navbarToggleHandler={navbarToggleHandler}
            />
          </>
        )}
        {user && (
          <li className="group relative lg:hidden">
            <button
              onClick={handleSignOut}
              className="ud-menu-scroll flex py-2 text-base text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
            >
              Sign Out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

interface SubmenuButtonProps {
  menuItem: MenuItem;
  index: number;
  openIndex: number;
  handleSubmenu: (index: number) => void;
  pathUrl: string;
  sticky: boolean;
  navbarToggleHandler: () => void;
}

const SubmenuButton: React.FC<SubmenuButtonProps> = ({
  menuItem,
  index,
  openIndex,
  handleSubmenu,
  pathUrl,
  sticky,
  navbarToggleHandler,
}) => (
  <>
    <button
      onClick={() => handleSubmenu(index)}
      className={`ud-menu-scroll flex items-center justify-between py-2 text-base ${
        pathUrl !== "/"
          ? "text-black group-hover:text-primary dark:text-white dark:group-hover:text-primary"
          : sticky
            ? "text-black group-hover:text-primary dark:text-white dark:group-hover:text-primary"
            : "dark:text-white"
      } lg:inline-flex lg:px-0 lg:py-6`}
    >
      {menuItem.title}
      <span className="pl-1">
        <svg
          className="duration-300 lg:group-hover:rotate-180"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
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
      {menuItem?.submenu?.map((submenuItem, i) => (
        <Link
          href={submenuItem.path || "#"}
          key={i}
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
);

interface AuthLinkProps {
  href: string;
  title: string;
  navbarToggleHandler: () => void;
}

const AuthLink: React.FC<AuthLinkProps> = ({
  href,
  title,
  navbarToggleHandler,
}) => (
  <li className="group relative lg:hidden">
    <Link
      onClick={navbarToggleHandler}
      scroll={false}
      href={href}
      className="ud-menu-scroll flex py-2 text-base text-dark group-hover:text-primary dark:text-white dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
    >
      {title}
    </Link>
  </li>
);

export default Navigation;