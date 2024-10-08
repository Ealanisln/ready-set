// Logo.tsx
import React from 'react';
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  sticky: boolean;
  pathUrl: string;
  navbarToggleHandler: () => void;
}

const Logo: React.FC<LogoProps> = ({ sticky, pathUrl, navbarToggleHandler }) => (
  <div className="w-60 max-w-full px-4">
    <Link
      href="/"
      className={`navbar-logo block w-full ${sticky ? "py-2" : "py-5"}`}
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
);

export default Logo;