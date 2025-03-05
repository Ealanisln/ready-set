import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthButtonsProps {
  sticky: boolean;
  pathUrl: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ sticky, pathUrl }) => {
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

  if (user) {
    return (
      <>
        <Link href={`/user/${user.id}`}>
          <p
            className={`loginBtn px-7 py-3 text-base font-medium ${
              !sticky && pathUrl === "/" ? "text-white" : "text-black"
            }`}
          >
            {user.user_metadata?.name || user.email}
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

const SignOutButton: React.FC<ButtonProps> = ({ sticky, pathUrl }) => {
  const supabase = createClient();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleSignOut}
      className={`signUpBtn rounded-lg px-6 py-3 text-base font-medium duration-300 ease-in-out ${
        pathUrl !== "/" || sticky
          ? "bg-blue-800 bg-opacity-100 text-white hover:bg-opacity-20 hover:text-dark"
          : "bg-blue-800 bg-opacity-20 text-white hover:bg-opacity-100 hover:text-white"
      }`}
    >
      Sign Out
    </button>
  );
};

const SignInButton: React.FC<ButtonProps> = ({ sticky, pathUrl }) => (
  <Link
    href="/sign-in"
    className={`px-7 py-3 text-base font-medium hover:opacity-70 ${
      pathUrl !== "/" || sticky
        ? "dark:text-white"
        : "text-black dark:text-white"
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