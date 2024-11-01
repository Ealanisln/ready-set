import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { ChevronDown, X } from "lucide-react";

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
  // Restored Desktop Menu with full content
  const DesktopMenu = () => (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-x-8">
        {menuData.map((menuItem, index) => (
          <li key={menuItem.id} className="group relative py-4">
            {menuItem.path ? (
              <Link
                href={menuItem.path}
                className={`flex items-center text-base font-medium ${getTextColorClasses()} hover:text-primary`}
              >
                {menuItem.title}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => handleSubmenu(index)}
                  className={`flex items-center text-base font-medium ${getTextColorClasses()} hover:text-primary`}
                >
                  {menuItem.title}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                
                <div className={`submenu absolute left-0 top-full min-w-[200px] rounded-lg bg-white p-2 shadow-lg transition-all duration-300 dark:bg-dark-2 ${
                  openIndex === index ? "visible opacity-100" : "invisible opacity-0"
                }`}>
                  {menuItem.submenu?.map((submenuItem) => (
                    <Link
                      href={submenuItem.path || "#"}
                      key={submenuItem.id}
                      className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                        pathUrl === submenuItem.path
                          ? "bg-amber-400/10 text-amber-500"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
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
      </ul>
    </nav>
  );

  // Mobile Menu Overlay (same as before)
  const MobileMenuOverlay = () => (
    <div 
      className={`fixed inset-0 z-50 lg:hidden ${
        navbarOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          navbarOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={navbarToggleHandler}
      />
      
      {/* Menu panel */}
      <nav
        className={`fixed right-0 top-0 bottom-0 w-72 transform overflow-y-auto bg-white/90 backdrop-blur-md transition-transform duration-300 ease-in-out dark:bg-dark-2/90 ${
          navbarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: '100vh' }}
      >
        {/* Close button */}
        <button
          onClick={navbarToggleHandler}
          className="absolute right-4 top-4 z-50 rounded-full p-2 text-amber-500 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-400/10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex h-full flex-col px-6 py-16">
          <ul className="space-y-2">
            {menuData.map((menuItem, index) => (
              <li key={menuItem.id} className="group">
                {menuItem.path ? (
                  <Link
                    onClick={closeNavbarOnNavigate}
                    scroll={false}
                    href={menuItem.path}
                    className="flex w-full rounded-lg px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-amber-100 dark:text-white dark:hover:bg-amber-400/10"
                  >
                    {menuItem.title}
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSubmenu(index)}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-amber-100 dark:text-white dark:hover:bg-amber-400/10"
                    >
                      {menuItem.title}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        openIndex === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="space-y-1 pl-4">
                        {menuItem.submenu?.map((submenuItem) => (
                          <Link
                            href={submenuItem.path || "#"}
                            key={submenuItem.id}
                            onClick={() => {
                              handleSubmenu(index);
                              navbarToggleHandler();
                            }}
                            className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                              pathUrl === submenuItem.path
                                ? "bg-amber-400/10 text-amber-500"
                                : "text-gray-600 hover:bg-amber-100 dark:text-gray-300 dark:hover:bg-amber-400/10"
                            }`}
                          >
                            {submenuItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t border-gray-200 py-6 dark:border-gray-700">
            {!session?.user ? (
              <div className="space-y-3">
                <Link
                  onClick={closeNavbarOnNavigate}
                  href="/signin"
                  className="block w-full rounded-lg bg-amber-100 px-4 py-3 text-center font-medium text-amber-900 transition-colors hover:bg-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/20"
                >
                  Sign In
                </Link>
                <Link
                  onClick={closeNavbarOnNavigate}
                  href="/signup"
                  className="block w-full rounded-lg bg-amber-400 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/", redirect: true });
                  navbarToggleHandler();
                }}
                className="block w-full rounded-lg bg-amber-100 px-4 py-3 text-center font-medium text-amber-900 transition-colors hover:bg-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/20"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <DesktopMenu />
      <MobileMenuOverlay />
    </>
  );
};

export default MobileMenu;