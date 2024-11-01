import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface MobileMenuProps {
  navbarOpen: boolean;
  menuData: MenuItem[];
  openIndex: number;
  handleSubmenu: (index: number) => void;
  closeNavbarOnNavigate: () => void;
  navbarToggleHandler: () => void;
  session: Session | null;
  pathUrl: string;
  getTextColorClasses: () => string;
}

interface MenuItem {
  id: string | number;
  title: string;
  path?: string;
  newTab?: boolean;
  submenu?: MenuItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  navbarOpen,
  menuData,
  openIndex,
  handleSubmenu,
  closeNavbarOnNavigate,
  navbarToggleHandler,
  session,
  pathUrl,
  getTextColorClasses
}) => {
  return (
    <nav
      className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${
        navbarOpen
          ? "visibility top-full opacity-100"
          : "invisible top-[120%] opacity-0"
      }`}
    >
      <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
        {menuData.map((menuItem, index) => (
          <li key={menuItem.id} className="group relative">
            {menuItem.path ? (
              <Link
                onClick={closeNavbarOnNavigate}
                scroll={false}
                href={menuItem.path}
                className={`ud-menu-scroll flex py-2 text-base text-dark dark:text-white lg:${getTextColorClasses()} group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6`}
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
                  className={`ud-menu-scroll flex items-center justify-between py-2 text-base text-dark dark:text-white lg:${getTextColorClasses()} group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6`}
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
                className="ud-menu-scroll flex py-2 text-base text-dark dark:text-white group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
              >
                Sign In
              </Link>
            </li>
            <li className="group relative lg:hidden">
              <Link
                onClick={closeNavbarOnNavigate}
                scroll={false}
                href="/signup"
                className="ud-menu-scroll flex py-2 text-dark dark:text-white group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
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
              className="ud-menu-scroll flex py-2 text-base text-dark dark:text-white group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6"
            >
              Sign Out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MobileMenu;