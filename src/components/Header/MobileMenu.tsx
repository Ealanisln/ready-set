import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const DesktopMenu: React.FC<{
  menuData: MenuItem[];
  openIndex: number;
  handleSubmenu: (index: number) => void;
  getTextColorClasses: () => string;
  pathUrl: string;
}> = ({ menuData, openIndex, handleSubmenu, getTextColorClasses, pathUrl }) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!menuData) return null;

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-x-8">
        {menuData.map((menuItem, index) => (
          <motion.li
            key={menuItem.id}
            className="group relative py-4"
            initial={hasMounted ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: hasMounted ? 0 : index * 0.1 }}
          >
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
                      className="submenu absolute left-0 top-full min-w-[200px] rounded-lg bg-white p-2 shadow-lg dark:bg-dark-2"
                    >
                      {menuItem.submenu?.map((submenuItem) => (
                        <motion.div
                          key={submenuItem.id}
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
  session: Session | null;
  pathUrl: string;
}> = ({
  navbarOpen,
  menuData,
  openIndex,
  handleSubmenu,
  closeNavbarOnNavigate,
  navbarToggleHandler,
  session,
  pathUrl
}) => {
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
                {menuData.map((menuItem, index) => (
                  <motion.li
                    key={menuItem.id}
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
                                {menuItem.submenu?.map((submenuItem) => (
                                  <motion.div
                                    key={submenuItem.id}
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
                                      className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                                        pathUrl === submenuItem.path
                                          ? "bg-amber-400/10 text-amber-500"
                                          : "text-gray-600 hover:bg-amber-100 dark:text-gray-300 dark:hover:bg-amber-400/10"
                                      }`}
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
                {!session?.user ? (
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
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => {
                        void signOut({ callbackUrl: "/", redirect: true });
                        navbarToggleHandler();
                      }}
                      className="block w-full rounded-lg bg-amber-100 px-4 py-3 text-center font-medium text-amber-900 transition-colors hover:bg-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/20"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </motion.div>
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
  session,
  pathUrl,
  getTextColorClasses
}) => {
  return (
    <>
      <DesktopMenu
        menuData={menuData}
        openIndex={openIndex}
        handleSubmenu={handleSubmenu}
        getTextColorClasses={getTextColorClasses}
        pathUrl={pathUrl}
      />
      <MobileMenuOverlay
        navbarOpen={navbarOpen}
        menuData={menuData}
        openIndex={openIndex}
        handleSubmenu={handleSubmenu}
        closeNavbarOnNavigate={closeNavbarOnNavigate}
        navbarToggleHandler={navbarToggleHandler}
        session={session}
        pathUrl={pathUrl}
      />
    </>
  );
};

export default MobileMenu;