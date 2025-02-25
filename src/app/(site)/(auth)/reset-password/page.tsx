"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [processingCode, setProcessingCode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Check if we have a code in the URL
      const code = searchParams.get("code");
      
      if (code) {
        setProcessingCode(true);
        console.log("Found reset code in URL:", code);
        setShowForm(true);
        setProcessingCode(false);
      } else {
        // No code, listen for auth state change as fallback
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          console.log("Auth state change event:", event);
          if (event === "PASSWORD_RECOVERY") {
            setShowForm(true);
          }
        });
        
        return () => {
          subscription.unsubscribe();
        };
      }
    };

    handlePasswordReset();
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoader(true);

    try {
      console.log("Attempting to update password...");
      
      // With the newer Supabase versions, we don't need to explicitly verify the OTP
      // The presence of the code in the URL will establish the necessary session context
      
      // Log the current auth state to help with debugging
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session state:", session ? "Active session" : "No active session");
      
      // If we have the code in the URL, that's a good sign the reset link is valid
      const code = searchParams.get("code");
      if (code) {
        console.log("Found code in URL, proceeding with password update");
      } else if (!session) {
        console.log("No code in URL and no active session");
        toast.error("Invalid password reset session. Please request a new password reset link.");
        router.push('/forgot-password');
        return;
      }
      
      // Now update the password
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }

      toast.success("Password updated successfully");
      
      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "An error occurred while updating your password");
    } finally {
      setLoader(false);
    }
  };

  // If we're still processing the code, show a loading indicator
  if (processingCode) {
    return (
      <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-20">
        <div className="container">
          <div className="flex justify-center items-center h-40">
            <Loader />
            <p className="ml-2">Verifying your reset link...</p>
          </div>
        </div>
      </section>
    );
  }

  // If we're not in a password recovery state, show a message
  if (!showForm) {
    return (
      <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-20">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">
                <h2 className="mb-5 text-2xl font-bold text-dark dark:text-white">Invalid or Expired Link</h2>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  This password reset link is invalid or has expired. Please request a new password reset.
                </p>
                <Link 
                  href="/forgot-password"
                  className="inline-block rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
                >
                  Request New Reset Link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
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

              <h2 className="mb-5 text-2xl font-bold text-dark dark:text-white">Reset Your Password</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-[22px]">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-[22px]">
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
                    disabled={loader}
                  >
                    {loader ? (
                      <>
                        <span>Processing</span>
                        <Loader />
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;