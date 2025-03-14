// src/components/Auth/SignOutButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button, ButtonProps } from "@/components/ui/button";
import toast from "react-hot-toast";
import { SupabaseClient } from "@supabase/supabase-js";

interface SignOutButtonProps extends ButtonProps {
  redirectTo?: string;
}

export default function SignOutButton({
  redirectTo = "/sign-in",
  children = "Sign Out",
  ...props
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const router = useRouter();

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        toast.error("Connection error. Try again later.");
      } finally {
        setIsInitializing(false);
      }
    };

    initSupabase();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) {
      toast.error("Unable to connect to authentication service");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success("Signed out successfully");
      router.push(redirectTo);
      router.refresh(); // Refresh to update auth state across the app
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading || isInitializing}
      {...props}
    >
      {isLoading ? "Signing out..." : isInitializing ? "Loading..." : children}
    </Button>
  );
}