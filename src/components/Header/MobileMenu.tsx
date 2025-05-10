// src/components/Header/MobileMenu.tsx

"use client";

import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { MenuItem } from "@/types/menu";
import { UserType } from "@/types/user";

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
    title: "Helpdesk Portal",
    path: "/admin",
  },
  [UserType.SUPER_ADMIN]: {
    id: 2,
    title: "Super Admin",
    path: "/admin",
  },
};

interface MobileMenuProps {
  navbarOpen: boolean;
  menuData: MenuItem[];
  openIndex: number;
  handleSubmenu: (index: number) => void;
  closeNavbarOnNavigate: () => void;
  navbarToggleHandler: () => void;
  pathUrl: string;
  sticky: boolean;
}

const DesktopMenu: React.FC<{
  menuData: MenuItem[];
  openIndex: number;
  handleSubmenu: (index: number) => void;
  pathUrl: string;
}> = ({ menuData, openIndex, handleSubmenu, pathUrl }) => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { user, userRole } = useUser();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!menuData) return null;

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-x-8">
        {menuData.map((menuItem, index) => (
          <motion.li
            key={`desktop-${menuItem.id}-${index}`}
            className="group relative py-4"
            initial={hasMounted ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: hasMounted ? 0 : index * 0.1 }}
          >
            {menuItem.path ? (
              <Link
                href={menuItem.path}
                className={`flex items-center text-base font-medium ${
                  pathUrl === "/va"
                    ? "text-white hover:text-primary"
                    : "text-dark dark:text-white hover:text-primary"
                }`}
              >
                {menuItem.title}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => handleSubmenu(index)}
                  className={`flex items-center text-base font-medium ${
                    pathUrl === "/va"
                      ? "text-white hover:text-primary"
                      : "text-dark dark:text-white hover:text-primary"
                  }`}
                >
                  {menuItem.title}
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="submenu absolute left-0 top-full z-50 min-w-[200px] rounded-lg bg-white p-2 shadow-lg dark:bg-dark-2"
                    >
                      {menuItem.submenu?.map((submenuItem, i) => (
                        <motion.div
                          key={`desktop-submenu-${submenuItem.id}-${i}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Link
                            href={submenuItem.path || "#"}
                            className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                              pathUrl === submenuItem.path
                                ? "bg-amber-400/10 text-amber-500"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                            }`}
                          >
                            {submenuItem.title}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};

const MobileMenuOverlay: React.FC<{
  navbarOpen: boolean;
  menuData: MenuItem[];
  openIndex: number;
  handleSubmenu: (index: number) => void;
  closeNavbarOnNavigate: () => void;
  navbarToggleHandler: () => void;
  pathUrl: string;
  sticky: boolean;
}> = ({
  navbarOpen,
  menuData,
  openIndex,
  handleSubmenu,
  closeNavbarOnNavigate,
  navbarToggleHandler,
  pathUrl,
  sticky
}) => {
  const { user, userRole } = useUser();
  const [supabase, setSupabase] = useState<any>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  // Get role-specific menu item
  const roleMenuItem = userRole ? ROLE_MENU_ITEMS[userRole] : null;

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
      }
    };

    initSupabase();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) return;

    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      window.location.href = "/";
      navbarToggleHandler();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!menuData) return null;

  return (
    <AnimatePresence>
      {navbarOpen && (
        <motion.div 
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={navbarToggleHandler}
          />
          
          <motion.nav
            className="fixed right-0 top-0 bottom-0 w-72 overflow-y-auto bg-white/90 backdrop-blur-md dark:bg-dark-2/90"
            style={{ height: '100vh' }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="mb-6 flex items-center justify-end">
                  <button
                    onClick={navbarToggleHandler}
                    className="text-dark hover:text-primary dark:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <ul className="mb-6 space-y-4">
                  {user && roleMenuItem && roleMenuItem.path && (
                    <li>
                      <Link
                        href={roleMenuItem.path}
                        className="text-base font-medium text-dark hover:text-primary dark:text-white"
                        onClick={closeNavbarOnNavigate}
                      >
                        {roleMenuItem.title}
                      </Link>
                    </li>
                  )}
                  {menuData.map((menuItem, index) => (
                    <li key={`mobile-${menuItem.id}-${index}`}>
                      {menuItem.submenu ? (
                        <>
                          <button
                            onClick={() => handleSubmenu(index)}
                            className="flex w-full items-center justify-between text-base font-medium text-dark hover:text-primary dark:text-white"
                          >
                            {menuItem.title}
                            <motion.div
                              animate={{ rotate: openIndex === index ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {openIndex === index && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 space-y-2 pl-4"
                              >
                                {menuItem.submenu.map((submenuItem, i) => (
                                  <motion.li
                                    key={`mobile-submenu-${submenuItem.id}-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {submenuItem.path && (
                                      <Link
                                        href={submenuItem.path}
                                        className="block text-sm text-dark/80 hover:text-primary dark:text-white/80"
                                        onClick={closeNavbarOnNavigate}
                                      >
                                        {submenuItem.title}
                                      </Link>
                                    )}
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : menuItem.path ? (
                        <Link
                          href={menuItem.path}
                          className="block text-base font-medium text-dark hover:text-primary dark:text-white"
                          onClick={closeNavbarOnNavigate}
                        >
                          {menuItem.title}
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auth buttons */}
              <div className="mt-auto">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex w-full items-center justify-center rounded-lg bg-amber-400 px-6 py-3 text-base font-medium text-black transition duration-300 ease-in-out hover:bg-amber-500 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/signin"
                      className="block w-full rounded-lg bg-gray-100 px-6 py-3 text-center text-base font-medium text-dark transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                      onClick={closeNavbarOnNavigate}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full rounded-lg bg-amber-400 px-6 py-3 text-center text-base font-medium text-black transition duration-300 ease-in-out hover:bg-amber-500 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                      onClick={closeNavbarOnNavigate}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  navbarOpen,
  menuData,
  openIndex,
  handleSubmenu,
  closeNavbarOnNavigate,
  navbarToggleHandler,
  pathUrl,
  sticky
}) => {
  const { user, userRole, isLoading } = useUser();
  const roleMenuItem = userRole ? ROLE_MENU_ITEMS[userRole] : null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <ul className="flex gap-x-8">
          {menuData.map((menuItem, index) => (
            <li key={`menu-${index}`} className="group relative">
              {menuItem.path ? (
                <Link
                  href={menuItem.path}
                  className={`flex py-6 text-base font-medium hover:text-primary ${
                    pathUrl === menuItem.path ? "text-primary" : ""
                  } ${
                    navbarOpen || sticky
                      ? "text-dark dark:text-white"
                      : pathUrl === "/va"
                      ? "text-white"
                      : "text-dark dark:text-white"
                  }`}
                >
                  {menuItem.title}
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => handleSubmenu(index)}
                    className={`flex items-center py-6 text-base font-medium hover:text-primary ${
                      navbarOpen || sticky
                        ? "text-dark dark:text-white"
                        : pathUrl === "/va"
                        ? "text-white"
                        : "text-dark dark:text-white"
                    }`}
                  >
                    {menuItem.title}
                    <span className="pl-1">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {/* Desktop Submenu */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        className="submenu absolute left-0 top-full z-50 min-w-[200px] rounded-lg bg-white p-2 shadow-lg dark:bg-dark-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {menuItem.submenu?.map((submenuItem, i) => (
                          <motion.div
                            key={`desktop-submenu-${submenuItem.id}-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Link
                              href={submenuItem.path || "#"}
                              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                                pathUrl === submenuItem.path
                                  ? "bg-amber-400/10 text-amber-500"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                              }`}
                            >
                              {submenuItem.title}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {navbarOpen && (
          <motion.div 
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={navbarToggleHandler}
            />
            
            <motion.nav
              className="fixed right-0 top-0 bottom-0 w-72 overflow-y-auto bg-white/90 backdrop-blur-md dark:bg-dark-2/90"
              style={{ height: '100vh' }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <motion.button
                onClick={navbarToggleHandler}
                className="absolute right-4 top-4 z-50 rounded-full p-2 text-amber-500 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-400/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-6 w-6" />
              </motion.button>

              <div className="flex h-full flex-col px-6 py-16">
                <motion.ul 
                  className="space-y-2"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                >
                  {user && roleMenuItem && roleMenuItem.path && (
                    <motion.li
                      className="group"
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: 50 }
                      }}
                    >
                      <Link
                        onClick={closeNavbarOnNavigate}
                        href={roleMenuItem.path}
                        className="flex w-full rounded-lg px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-amber-100 dark:text-white dark:hover:bg-amber-400/10"
                      >
                        {roleMenuItem.title}
                      </Link>
                    </motion.li>
                  )}
                  {menuData.map((menuItem, index) => (
                    <motion.li
                      key={`mobile-${menuItem.id}-${index}`}
                      className="group"
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: 50 }
                      }}
                    >
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
                            <motion.div
                              animate={{ rotate: openIndex === index ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </motion.div>
                          </button>
                          
                          <AnimatePresence>
                            {openIndex === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-1 pl-4">
                                  {menuItem.submenu?.map((submenuItem, i) => (
                                    <motion.div
                                      key={`mobile-submenu-${submenuItem.id}-${i}`}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Link
                                        href={submenuItem.path || "#"}
                                        onClick={() => {
                                          handleSubmenu(index);
                                          navbarToggleHandler();
                                        }}
                                        className="block rounded-lg px-4 py-2 text-sm transition-colors text-gray-600 hover:bg-amber-100 dark:text-gray-300 dark:hover:bg-amber-400/10"
                                      >
                                        {submenuItem.title}
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  className="mt-auto border-t border-gray-200 py-6 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {!user && !isLoading ? (
                    <div className="space-y-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          onClick={closeNavbarOnNavigate}
                          href="/signin"
                          className="block w-full rounded-lg bg-amber-100 px-4 py-3 text-center font-medium text-amber-900 transition-colors hover:bg-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/20"
                        >
                          Sign In
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          onClick={closeNavbarOnNavigate}
                          href="/signup"
                          className="block w-full rounded-lg bg-amber-400 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600"
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </div>
                  ) : user ? (
                    <div className="space-y-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <button
                          onClick={() => {
                            document.dispatchEvent(new CustomEvent('user-sign-out'));
                            closeNavbarOnNavigate();
                          }}
                          className="block w-full rounded-lg bg-amber-400 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    </div>
                  ) : null}
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;