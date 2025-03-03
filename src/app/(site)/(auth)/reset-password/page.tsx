"use client";

import React, { useState, useEffect, Suspense } from "react";
import { resetPasswordAction } from "@/app/actions/reset-password";
import { toast } from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

// Separate submit button component to track form submission state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="focus:shadow-outline flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-bold text-white hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
    >
      {pending ? (
        <>
          <span className="mr-2">Updating Password</span>
          <Loader />
        </>
      ) : (
        "Update Password"
      )}
    </button>
  );
}

// Loading fallback component
function ResetPasswordFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="flex justify-center items-center h-40">
          <Loader />
        </div>
      </div>
    </div>
  );
}

// Component that uses the search params (wrapped in Suspense by the parent)
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [resetCode, setResetCode] = useState<string>("");
  const [hasCode, setHasCode] = useState<boolean>(false);

  // Extract reset code from URL parameters
  useEffect(() => {
    const code = searchParams.get("code");
    
    if (code) {
      console.log("Reset code found in URL:", code.substring(0, 5) + "...");
      setResetCode(code);
      setHasCode(true);
    } else {
      console.log("No reset code found in URL");
      setHasCode(false);
    }
    
    // Check for status messages
    const message = searchParams.get("message");
    const type = searchParams.get("type");
    
    if (message) {
      if (type === "error") {
        toast.error(message);
      } else if (type === "success") {
        toast.success(message);
      }
    }
  }, [searchParams]);

  // Request a new password reset link
  const requestNewResetLink = () => {
    window.location.href = "/forgot-password";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-gray-600">Please enter your new password below</p>
          
          {!hasCode && (
            <div className="mt-2 p-2 bg-red-50 rounded-md">
              <p className="text-sm text-red-600">
                No reset code found. Please use the link from your email or request a new one.
              </p>
            </div>
          )}
        </div>

        {hasCode ? (
          <form action={resetPasswordAction}>
            {/* Hidden field to pass the reset code to the server action */}
            <input type="hidden" name="resetCode" value={resetCode} />
            
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border border-gray-300 p-3"
                placeholder="Enter new password"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be different from your current password and at least 6 characters long
              </p>
            </div>

            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full rounded-md border border-gray-300 p-3"
                placeholder="Confirm new password"
                required
              />
            </div>

            <SubmitButton />
          </form>
        ) : (
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <p className="text-gray-700 mb-4">
              You need a valid password reset link to continue.
            </p>
            <button
              onClick={requestNewResetLink}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Request New Reset Link
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="mt-4">
            <Link
              href="/login"
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the form with Suspense
export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}