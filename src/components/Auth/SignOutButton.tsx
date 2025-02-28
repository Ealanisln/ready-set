// src/components/Auth/SignOutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button, ButtonProps } from "@/components/ui/button";
import toast from "react-hot-toast";

interface SignOutButtonProps extends ButtonProps {
  redirectTo?: string;
}

export default function SignOutButton({
  redirectTo = "/sign-in",
  children = "Sign Out",
  ...props
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
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
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Signing out..." : children}
    </Button>
  );
}