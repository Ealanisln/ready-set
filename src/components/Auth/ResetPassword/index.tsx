"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [authEvent, setAuthEvent] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      setAuthEvent(event);
      
      if (event === "PASSWORD_RECOVERY") {
        console.log("PASSWORD_RECOVERY event detected");
        setIsReady(true);
      }
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Function to update the password
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Attempting to update password");
      
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) {
        console.error("Error updating password:", error);
        toast.error(error.message);
        return;
      }
      
      console.log("Password updated successfully");
      toast.success("Password updated successfully!");
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Uncaught error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if we're not ready
  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Verifying your password reset link</h1>
          <p className="mb-4">Please wait while we verify your password reset link.</p>
          <p className="text-sm text-gray-500 mb-4">Current auth event: {authEvent || "None"}</p>
          <div className="flex justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-gray-600">Please enter your new password below</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3"
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3"
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline flex justify-center items-center"
          >
            {loading ? (
              <>
                <span className="mr-2">Updating Password</span>
                <Loader />
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-500 hover:text-blue-700 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}