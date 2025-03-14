// src/app/actions/login.ts

"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  // Use cookies() to opt out of caching
  await cookies();

  // Create and await the Supabase client
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(`Login attempt for: ${email}`);

  // Form validation
  if (!email || !password) {
    console.log("Missing email or password");
    redirect("/sign-in?error=Email+and+password+are+required");
  }

  // Try to sign in directly
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Login error:", error.message, error.code);

    // Instead of using password reset as a user check, use a direct database query
    // Check if user exists by querying the "user" table
    const { data: userData, error: queryError } = await supabase
      .from("user") // Use your user table name here
      .select("email")
      .eq("email", email)
      .maybeSingle();

    const userExists = userData !== null;

    if (userExists) {
      console.log(
        "User exists but password is incorrect - likely a migration issue",
      );
      redirect(
        `/sign-in?error=${encodeURIComponent('Incorrect password. Please try again or use "Forgot Password" to reset it.')}`,
      );
    } else {
      console.log("User does not exist");
      redirect(
        `/sign-in?error=${encodeURIComponent("Account not found. Please check your email or sign up.")}`,
      );
    }
  }

  // Redirect to home page on successful login
  redirect("/");
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
