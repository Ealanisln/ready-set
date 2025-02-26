// app/actions/reset-password.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Helper function for redirects with encoded messages
export async function encodedRedirect(
  type: "success" | "error",
  path: string,
  message: string,
  preserveParams: string[] = []
) {
  const searchParams = new URLSearchParams();
  searchParams.append("type", type);
  searchParams.append("message", message);
  
  // Preserve specified URL parameters
  for (const param of preserveParams) {
    const value = new URL(path, "http://localhost").searchParams.get(param);
    if (value) {
      searchParams.append(param, value);
    }
  }
  
  // Extract the base path without query parameters
  const basePath = path.split('?')[0];
  
  return redirect(`${basePath}?${searchParams.toString()}`);
}

// Reset password server action
export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const resetCode = formData.get("resetCode") as string;
  
  console.log("Reset action started with code:", resetCode ? `${resetCode.substring(0, 5)}...` : "missing");
  
  // Create the server-side Supabase client
  const supabase = await createClient();

  // Validate inputs
  if (!password || !confirmPassword) {
    return await encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
      ["code"]
    );
  }

  if (password !== confirmPassword) {
    return await encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match",
      ["code"]
    );
  }

  if (password.length < 6) {
    return await encodedRedirect(
      "error",
      "/reset-password",
      "Password must be at least 6 characters",
      ["code"]
    );
  }

  if (!resetCode) {
    return await encodedRedirect(
      "error",
      "/reset-password",
      "Reset code is missing. Please use the link from your email."
    );
  }

  try {
    console.log("Starting password reset with code", resetCode.substring(0, 5) + "...");
    
    // Step 1: Exchange the reset code for a session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(resetCode);
    
    if (sessionError) {
      console.error("Session exchange error:", sessionError);
      return await encodedRedirect(
        "error",
        "/reset-password",
        sessionError.message || "Invalid or expired reset link"
      );
    }
    
    console.log("Successfully exchanged code for session");

    // Step 2: Update the password with the new session
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      console.error("Password update error:", updateError);
      
      // Pass the exact error message from Supabase
      return await encodedRedirect(
        "error",
        "/reset-password?code=" + resetCode,
        updateError.message
      );
    }

    console.log("Password updated successfully");
    
    // Success - redirect to login
    return await encodedRedirect(
      "success",
      "/login",
      "Password updated successfully. Please log in with your new password."
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    
    // Make sure we keep the code in the URL when redirecting after an error
    return await encodedRedirect(
      "error",
      "/reset-password?code=" + resetCode,
      err.message || "An unexpected error occurred"
    );
  }
}