// NavbarToggle.tsx
import React from 'react';

interface NavbarToggleProps {
  navbarOpen: boolean;
  navbarToggleHandler: () => void;
  pathUrl: string;
  sticky: boolean;
}

const NavbarToggle: React.FC<NavbarToggleProps> = ({ navbarOpen, navbarToggleHandler, pathUrl, sticky }) => (
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
          navbarOpen ? (index === 1 ? "opacity-0" : index === 0 ? "top-[7px] rotate-45" : "top-[-8px] -rotate-45") : ""
        } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
          pathUrl === "/" && sticky ? "bg-dark dark:bg-white" : "bg-white"
        }`}
      />
    ))}
  </button>
);

export default NavbarToggle;