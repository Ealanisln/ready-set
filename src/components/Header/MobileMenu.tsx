// src/components/Header/MobileMenu.tsx

"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SupabaseClient } from "@supabase/supabase-js";

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
  type?: string;
}

interface MobileMenuProps {
  navbarOpen: boolean;
  menuData: MenuItem[];
  openIndex: number;
  handleSubmenu: (index: number) => void;
  closeNavbarOnNavigate: () => void;
  navbarToggleHandler: () => void;
  user: User | null;
  pathUrl: string;
  getTextColorClasses: () => string; // This function determines the base text color
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  navbarOpen,
  menuData,
  openIndex,
  handleSubmenu,
  closeNavbarOnNavigate,
  navbarToggleHandler,
  user,
  pathUrl,
  getTextColorClasses, // Use the passed function
}) => {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        toast.error("Error connecting to service. Please try again later.");
      }
    };

    initSupabase();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) {
      toast.error("Unable to connect to authentication service");
      return;
    }

    try {
      setIsSigningOut(true);
      navbarToggleHandler(); // Close mobile menu

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
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

  return (
    <nav
      id="navbarCollapse"
      className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${
        navbarOpen
          ? "visibility top-full opacity-100"
          : "invisible top-[120%] opacity-0"
      }`}
    >
      <ul className="block lg:flex lg:space-x-12">
        {menuData.map((menuItem, index) => (
          <li key={menuItem.id} className="group relative">
            {menuItem.submenu ? (
              <>
                {/* MODIFIED: Removed hardcoded text-dark, dark:text-white, lg:text-white etc. */}
                <button
                  onClick={() => handleSubmenu(index)}
                  className={`flex cursor-pointer items-center justify-between py-2 text-base group-hover:text-primary dark:group-hover:text-primary lg:mr-0 lg:inline-flex lg:py-6 lg:px-0 ${ // Base layout/hover styles
                    openIndex === index ? "text-primary dark:text-primary" : "" // Active/Open state color
                  } ${getTextColorClasses()}`} // Dynamic color based on route/sticky
                >
                  {menuItem.title}
                  <span className="pl-3">
                    <svg width="15" height="14" viewBox="0 0 15 14">
                      <path
                        d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`submenu relative lg:absolute lg:left-0 lg:top-full lg:rounded-md lg:bg-white lg:px-8 lg:py-8 lg:shadow-lg lg:dark:bg-dark-2 ${
                    openIndex === index ? "block" : "hidden"
                  }`}
                >
                  <div className="relative grid gap-2 rounded-sm lg:grid-cols-1">
                     {/* Submenu items retain their specific styling */}
                    {menuItem.submenu.map((submenuItem) => (
                      <Link
                        href={submenuItem.path || "#"}
                        key={submenuItem.id}
                        onClick={closeNavbarOnNavigate}
                        target={submenuItem.newTab ? "_blank" : "_self"}
                        className={`block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3 ${ // Submenu specific styles
                          pathUrl === submenuItem.path
                            ? "text-primary dark:text-white" // Active submenu item color
                            : ""
                        }`}
                      >
                        {submenuItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
               // MODIFIED: Removed hardcoded text-dark, dark:text-white, lg:text-white etc.
              <Link
                href={menuItem.path || "#"}
                onClick={closeNavbarOnNavigate}
                target={menuItem.newTab ? "_blank" : "_self"}
                className={`block py-2 text-base group-hover:text-primary dark:group-hover:text-primary lg:mr-0 lg:inline-flex lg:py-6 lg:px-0 ${ // Base layout/hover styles
                  pathUrl === menuItem.path
                    ? "text-primary dark:text-primary" // Active state color
                    : ""
                } ${getTextColorClasses()}`} // Dynamic color based on route/sticky
              >
                {menuItem.title}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Mobile auth buttons */}
      <div className="flex flex-col gap-2 border-t border-stroke pt-3 dark:border-dark-3 lg:hidden">
        {user ? (
          <>
            {/* These buttons have their own styling, often independent of navbar text color */}
            <Link
              href={`/user/${user.id}`}
              onClick={closeNavbarOnNavigate}
              className="rounded-md px-6 py-3 text-base font-medium text-dark dark:text-white" // Standard mobile link style
            >
              {user.name}
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut || !supabase}
              className={`rounded-md ${
                isSigningOut || !supabase
                  ? "bg-blue-400" // Disabled/loading state
                  : "bg-blue-500 hover:bg-blue-600" // Standard button style
              } px-6 py-3 text-base font-medium text-white transition-colors`}
            >
              {isSigningOut ? "Signing Out..." : !supabase ? "Connecting..." : "Sign Out"}
            </button>
          </>
        ) : (
          <>
            {/* These buttons have their own styling */}
            <Link
              href="/sign-in"
              onClick={closeNavbarOnNavigate}
              className="rounded-md bg-body-color/10 px-6 py-3 text-base font-medium text-dark dark:bg-white/10 dark:text-white" // Standard mobile link style
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={closeNavbarOnNavigate}
              className="rounded-md bg-blue-500 px-6 py-3 text-base font-medium text-white" // Standard mobile button style
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default MobileMenu;