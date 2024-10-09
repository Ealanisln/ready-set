import React from 'react';
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Session } from "@auth/core/types";

interface AuthButtonsProps {
  session: Session | null;
  sticky: boolean;
  pathUrl: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ session, sticky, pathUrl }) => {
  if (session?.user) {
    return (
      <>
        <Link href={`/user/${session.user.id}`}>
          <p
            className={`loginBtn px-7 py-3 text-base font-medium ${
              !sticky && pathUrl === "/" ? "text-white" : "text-black"
            }`}
          >
            {session.user.name}
          </p>
        </Link>
        <SignOutButton sticky={sticky} pathUrl={pathUrl} />
      </>
    );
  }

  return (
    <>
      <SignInButton sticky={sticky} pathUrl={pathUrl} />
      <SignUpButton sticky={sticky} pathUrl={pathUrl} />
    </>
  );
};

interface ButtonProps {
  sticky: boolean;
  pathUrl: string;
}

const SignOutButton: React.FC<ButtonProps> = ({ sticky, pathUrl }) => (
  <button
    onClick={() => signOut({ callbackUrl: "/", redirect: true })}
    className={`signUpBtn rounded-lg px-6 py-3 text-base font-medium duration-300 ease-in-out ${
      pathUrl !== "/" || sticky
        ? "bg-blue-800 bg-opacity-100 text-white hover:bg-opacity-20 hover:text-dark"
        : "bg-blue-800 bg-opacity-20 text-white hover:bg-opacity-100 hover:text-white"
    }`}
  >
    Sign Out
  </button>
);

const SignInButton: React.FC<ButtonProps> = ({ sticky, pathUrl }) => (
  <Link
    href="/signin"
    className={`px-7 py-3 text-base font-medium hover:opacity-70 ${
      pathUrl !== "/" || sticky ? "dark:text-white" : "text-black dark:text-white"
    }`}
  >
    Sign In
  </Link>
);

const SignUpButton: React.FC<ButtonProps> = ({ sticky, pathUrl }) => (
  <Link
    href="/signup"
    className={`rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out ${
      pathUrl !== "/" || sticky
        ? "bg-primary hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
        : "bg-white/10 hover:bg-white/20"
    }`}
  >
    Sign Up
  </Link>
);

export default AuthButtons;