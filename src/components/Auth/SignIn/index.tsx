// src/components/Auth/SignIn/index.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import Loader from "@/components/Common/Loader";
import { login, FormState } from "@/app/actions/login";
import GoogleAuthButton from "@/components/Auth/GoogleAuthButton";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { H } from 'highlight.run';
import { logAuthError, trackAuthSuccess } from '@/utils/highlight-auth-logger';

const Signin = ({
  searchParams,
}: {
  searchParams?: { error?: string; message?: string; returnTo?: string };
}) => {
  const { isLoading: isUserLoading, session } = useUser();
  const router = useRouter();

  const [state, formAction] = useActionState<FormState, FormData>(login, {
    error: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "magic">(
    "password",
  );
  const [showAlternativeMethods, setShowAlternativeMethods] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    magicLinkEmail: "",
    general: "",
  });

  // Get returnTo from URL parameters
  const [returnTo, setReturnTo] = useState<string>("/");

  useEffect(() => {
    // Get returnTo from URL parameters
    const params = new URLSearchParams(window.location.search);
    const returnPath = params.get("returnTo");
    if (returnPath) {
      setReturnTo(returnPath);
    }
  }, []);

  useEffect(() => {
    if (state?.error) {
      setErrors((prev) => ({ ...prev, general: state.error || "" }));
      setLoading(false);
      
      // Track login error with Highlight
      try {
        logAuthError(state.error, {
          action: 'login',
          email: loginData.email,
          returnTo: returnTo
        });
      } catch (err) {
        console.error('Failed to log auth error:', err);
      }
    }
    
    // If redirectTo is set in the state, we're being redirected by the server
    if (state?.redirectTo) {
      console.log("Login action is handling redirect to:", state.redirectTo);
      
      // Track successful login
      try {
        trackAuthSuccess({
          action: 'login',
          email: loginData.email,
          returnTo: returnTo,
          redirectTo: state.redirectTo
        });
      } catch (err) {
        console.error('Failed to track auth success:', err);
      }
      
      // Let the server handle the redirect
    }
  }, [state, loginData.email, returnTo]);

  useEffect(() => {
    if (searchParams?.error) {
      setErrors((prev) => ({ ...prev, general: searchParams.error || "" }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === "email" ? value.toLowerCase() : value;
    setLoginData((prev) => ({ ...prev, [name]: processedValue }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleMagicLinkEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMagicLinkEmail(e.target.value.toLowerCase());
    setErrors((prev) => ({ ...prev, magicLinkEmail: "", general: "" }));
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!magicLinkEmail) {
      setErrors((prev) => ({ ...prev, magicLinkEmail: "Email is required" }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(magicLinkEmail)) {
      setErrors((prev) => ({
        ...prev,
        magicLinkEmail: "Please enter a valid email",
      }));
      return;
    }

    setMagicLinkLoading(true);

    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = await createClient();

      const { error } = await supabase.auth.signInWithOtp({
        email: magicLinkEmail,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (error: any) {
      console.error("Magic link error:", error);
      let errorMessage = "Unable to send magic link. Please check your email and try again.";
      if (error?.message?.includes("User not found")) {
         errorMessage = "Email not found. Please sign up first.";
      }
      setErrors((prev) => ({
        ...prev,
        magicLinkEmail: errorMessage,
      }));
    } finally {
      setMagicLinkLoading(false);
    }
  };

  // Add new useEffect to track errors and auth redirects
  useEffect(() => {
    try {
      // Track page view with context
      if (typeof window !== 'undefined' && window.H) {
        H.track('auth_signin_page_view', {
          hasError: !!errors.general || !!searchParams?.error,
          hasReturnTo: !!returnTo,
          returnTo: returnTo,
          timestamp: new Date().toISOString()
        });
      }
      
      // Track auth errors from URL parameters
      if (searchParams?.error) {
        logAuthError(searchParams.error, {
          action: 'login',
          returnTo: returnTo
        });
      }
    } catch (err) {
      console.error('Failed to track auth page view:', err);
    }
  }, [searchParams, returnTo, errors.general]);

  if (isUserLoading) {
    return (
      <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-20">
        <div className="container">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Loader />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (session) {
     return null;
  }

  return (
    <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-20">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"
              data-wow-delay=".15s"
            >
              <div className="mb-10 text-center">
                <Link href="/" className="mx-auto inline-block max-w-[160px]">
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo-dark.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="hidden dark:block"
                  />
                </Link>
              </div>

              {searchParams?.message && (
                <div className="mb-4 rounded border border-green-400 bg-green-100 p-3 text-green-700">
                  {searchParams.message}
                </div>
              )}

              {errors.general && (
                <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                  {errors.general}
                </div>
              )}

              {/* Primary option: Google login */}
              <div className="mb-5">
                <h3 className="mb-4 text-base font-medium text-dark dark:text-white">
                  Sign in with
                </h3>
                <GoogleAuthButton />
              </div>

              {/* Sign up link */}
              <div className="mb-5">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="relative mb-5 flex items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-dark-3"></div>
                <span className="mx-4 flex-shrink text-xs uppercase text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-gray-300 dark:border-dark-3"></div>
              </div>
              
              {/* Secondary options: Email/Password or Magic Link */}
              <div className="mb-5 flex rounded border">
                <button
                  onClick={() => setLoginMethod("password")}
                  className={`flex-1 py-2 text-sm font-medium ${
                    loginMethod === "password"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 dark:bg-dark-2 dark:text-gray-300"
                  }`}
                >
                  Email & Password
                </button>
                <button
                  onClick={() => setLoginMethod("magic")}
                  className={`flex-1 py-2 text-sm font-medium ${
                    loginMethod === "magic"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 dark:bg-dark-2 dark:text-gray-300"
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {/* Password login form */}
              {loginMethod === "password" && (
                <form action={formAction} className="mb-5">
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={`w-full rounded-md border ${
                        errors.email ? "border-red-500" : "border-stroke"
                      } bg-transparent px-5 py-3 text-base text-body-color outline-none transition focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white`}
                      value={loginData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className={`w-full rounded-md border ${
                        errors.password ? "border-red-500" : "border-stroke"
                      } bg-transparent px-5 py-3 text-base text-body-color outline-none transition focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white`}
                      value={loginData.password}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  {/* Hidden input for returnTo */}
                  <input
                    type="hidden"
                    name="returnTo"
                    value={returnTo}
                  />
                  <div className="mb-6">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-blue-dark"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader />
                          <span className="ml-2">Signing in...</span>
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Magic Link login form */}
              {loginMethod === "magic" && (
                <form onSubmit={handleSendMagicLink} noValidate>
                  {magicLinkSent ? (
                    <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-left">
                      <h3 className="mb-2 font-medium text-green-700">
                        Magic link sent!
                      </h3>
                      <p className="text-sm text-green-600">
                        We've sent a login link to{" "}
                        <strong>{magicLinkEmail}</strong>. Please check your
                        inbox and click the link to sign in.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-[22px]">
                        <input
                          type="email"
                          name="magicLinkEmail"
                          placeholder="Your email address"
                          value={magicLinkEmail}
                          onChange={handleMagicLinkEmailChange}
                          className={`w-full rounded-md border ${
                            errors.magicLinkEmail
                              ? "border-red-500"
                              : "border-stroke"
                          } bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary`}
                        />
                        {errors.magicLinkEmail && (
                          <p className="mt-1 text-left text-sm text-red-500">
                            {errors.magicLinkEmail}
                          </p>
                        )}
                      </div>

                      <div className="mb-5">
                        <button
                          type="submit"
                          disabled={magicLinkLoading}
                          className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {magicLinkLoading ? (
                            <>
                              <span>Sending link</span>
                              <Loader />
                            </>
                          ) : (
                            "Send Magic Link"
                          )}
                        </button>
                      </div>

                      <p className="mb-5 text-xs text-gray-500">
                        We'll email you a magic link for password-free sign in.
                      </p>
                    </>
                  )}
                </form>
              )}
              
              <div>
                <span className="absolute right-1 top-1">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="1.39737"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 1.39737 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.39737"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 1.39737 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 13.6943 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 13.6943 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 25.9911 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 25.9911 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 38.288 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 38.288 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.39737"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 1.39737 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 13.6943 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 25.9911 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 38.288 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.39737"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 1.39737 14.0086)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 13.6943 14.0086)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 25.9911 14.0086)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 38.288 14.0086)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
                <span className="absolute bottom-1 left-1">
                  <svg
                    width="29"
                    height="40"
                    viewBox="0 0 29 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="2.288"
                      cy="25.9912"
                      r="1.39737"
                      transform="rotate(-90 2.288 25.9912)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="25.9911"
                      r="1.39737"
                      transform="rotate(-90 14.5849 25.9911)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="25.9911"
                      r="1.39737"
                      transform="rotate(-90 26.7216 25.9911)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="2.288"
                      cy="13.6944"
                      r="1.39737"
                      transform="rotate(-90 2.288 13.6944)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="13.6943"
                      r="1.39737"
                      transform="rotate(-90 14.5849 13.6943)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="13.6943"
                      r="1.39737"
                      transform="rotate(-90 26.7216 13.6943)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="2.288"
                      cy="38.0087"
                      r="1.39737"
                      transform="rotate(-90 2.288 38.0087)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="2.288"
                      cy="1.39739"
                      r="1.39737"
                      transform="rotate(-90 2.288 1.39739)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="38.0089"
                      r="1.39737"
                      transform="rotate(-90 14.5849 38.0089)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="38.0089"
                      r="1.39737"
                      transform="rotate(-90 26.7216 38.0089)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="1.39761"
                      r="1.39737"
                      transform="rotate(-90 14.5849 1.39761)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="1.39761"
                      r="1.39737"
                      transform="rotate(-90 26.7216 1.39761)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;