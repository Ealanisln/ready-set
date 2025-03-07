// src/components/Auth/SignIn/index.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";
import { login, signup } from '@/app/actions/login';
import GoogleAuthButton from "@/components/Auth/GoogleAuthButton"; 

const Signin = ({ searchParams }: { searchParams?: { error?: string; message?: string } }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert email to lowercase if the field is email
    const processedValue = name === 'email' ? value.toLowerCase() : value;
    setLoginData((prev) => ({ ...prev, [name]: processedValue }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  // Display error from URL params if present
  useEffect(() => {
    if (searchParams?.error) {
      setErrors((prev) => ({ ...prev, general: searchParams.error || "" }));
    }
  }, [searchParams]);

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
                <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  {searchParams.message}
                </div>
              )}

              {errors.general && (
                <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              <form noValidate>
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

                <div className="flex space-x-4 mb-5">
                  <button
                    formAction={login}
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
                  
                  <button
                    formAction={signup}
                    disabled={loading}
                    className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-transparent px-5 py-3 text-base text-dark transition duration-300 ease-in-out hover:bg-gray-100 dark:text-white dark:border-dark-3 dark:hover:bg-dark-2/80 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Sign Up
                  </button>
                </div>
                
                {/* Google Sign-in Button */}
                <div className="mb-5">
                  {/* <GoogleAuthButton /> */}
                  <GoogleAuthButton />
                </div>

                {/* Or divider */}
                <div className="relative flex justify-center text-xs uppercase mb-5">
                  <span className="bg-white dark:bg-dark-2 px-2 text-gray-500">Or</span>
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-300 dark:bg-dark-3"></div>
                </div>
              </form>

              <Link
                href="/forgot-password"
                className="mb-2 inline-block text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary"
              >
                Forgot Password?
              </Link>

              {/* Migration notice - can be removed after migration is complete */}
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded text-sm">
                <p><strong>Important:</strong> If you're a returning user from our previous system and can't log in, please use the "Forgot password" link to reset your password.</p>
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