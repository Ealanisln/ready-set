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

const Signin = ({
  searchParams,
}: {
  searchParams?: { error?: string; message?: string };
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
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    magicLinkEmail: "",
    general: "",
  });

  useEffect(() => {
    if (state?.error) {
      setErrors((prev) => ({ ...prev, general: state.error || "" }));
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    if (searchParams?.error) {
      setErrors((prev) => ({ ...prev, general: searchParams.error || "" }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (session && !isUserLoading) {
       console.log("SignIn: Session detected, redirecting to /");
       router.push("/");
    }
  }, [session, isUserLoading, router]);

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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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

              {loginMethod === "password" ? (
                <form
                  action={formAction}
                  noValidate
                  onSubmit={() => setLoading(true)}
                >
                  <div className="mb-[22px]">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={loginData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border ${
                        errors.email ? "border-red-500" : "border-stroke"
                      } bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-left text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="mb-[22px]">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border ${
                        errors.password ? "border-red-500" : "border-stroke"
                      } bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-left text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="mb-5 flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <span>Signing in</span>
                          <Loader />
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>

                    <Link
                      href="/sign-up"
                      className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-transparent px-5 py-3 text-base text-dark transition duration-300 ease-in-out hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2/80"
                    >
                      Sign Up
                    </Link>
                  </div>
                </form>
              ) : (
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

              {!(loginMethod === "magic" && magicLinkSent) && (
                <>
                  <div className="relative mb-5 flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 dark:bg-dark-2">
                      Or
                    </span>
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-300 dark:bg-dark-3"></div>
                  </div>

                  <div className="mb-5">
                    <GoogleAuthButton />
                  </div>
                </>
              )}

              <div className="mt-6 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                <p>
                  <strong>Important:</strong> If you're a returning user from
                  our previous system and can't log in, please use the "Magic
                  Link" option to sign in.
                </p>
              </div>

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