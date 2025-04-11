// src/app/actions/login.ts

"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserType } from "@prisma/client";

export interface FormState {
  error?: string;
}

export async function login(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  await cookies();
  const supabase = await createClient();

  const email = formData.get("email")?.toString().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const { data: userData } = await supabase
      .from("user")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    return userData 
      ? { error: "Incorrect password. Please try again or use Magic Link." }
      : { error: "Account not found. Please check your email or sign up." };
  }

  // Get user profile to determine the correct dashboard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Failed to get user data" };
  }

  // Get user type from profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("type")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    return { error: "Failed to get user profile" };
  }

  if (!profile?.type) {
    console.error("No profile type found for user:", user.id);
    return { error: "User profile type not found" };
  }

  // Redirect based on user type
  const userType = profile.type.toLowerCase();
  let redirectPath = "/";

  console.log("User type for redirection:", userType);

  switch (userType) {
    case UserType.VENDOR.toLowerCase():
      redirectPath = "/vendor";
      break;
    case UserType.CLIENT.toLowerCase():
      redirectPath = "/client";
      break;
    case UserType.DRIVER.toLowerCase():
      redirectPath = "/driver";
      break;
    case UserType.HELPDESK.toLowerCase():
      redirectPath = "/helpdesk";
      break;
    case UserType.ADMIN.toLowerCase():
    case UserType.SUPER_ADMIN.toLowerCase():
      redirectPath = "/admin";
      break;
    default:
      console.warn("Unknown user type:", userType);
      redirectPath = "/client"; // Default to client dashboard
  }

  console.log("Redirecting user to:", redirectPath);
  redirect(redirectPath);
  return { error: "" }; // Unreachable but satisfies TypeScript
}

export async function signup(formData: FormData) {
  // Use cookies() to opt out of caching
  await cookies();

  // Create and await the Supabase client
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Form validation
  if (!email || !password) {
    redirect("/sign-in?error=Email+and+password+are+required");
  }

  // Password strength validation (optional)
  if (password.length < 8) {
    redirect("/sign-in?error=Password+must+be+at+least+8+characters+long");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  // Check if email confirmation is required
  const emailConfirmationRequired = !data.session;
  if (emailConfirmationRequired) {
    // Redirect to a confirmation page
    redirect("/signup-confirmation");
  } else {
    // If email confirmation is not required, redirect to home
    redirect("/");
  }
}
