// src/components/Dashboard/AdminView/PasswordChange.tsx

import { Toaster, toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SupabaseClient } from "@supabase/supabase-js";

interface PasswordChangeProps {
  userId?: string;
  onPasswordUpdate?: (success: boolean, message: string) => void;
}

export const PasswordChange = ({
  userId,
  onPasswordUpdate,
}: PasswordChangeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const methods = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetMethods = useForm({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const client = await createClient();
        setSupabase(client);
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
      }
    };

    initSupabase();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser(user);
          const { data: userData, error } = await supabase
            .from("users")
            .select("type")
            .eq("id", user.id)
            .single();

          if (!error && userData) {
            setIsAdmin(
              userData.type === "admin" || userData.type === "super_admin",
            );
          }
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };

    getCurrentUser();
  }, [supabase]);

  const onPasswordSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!supabase) {
      toast.error("Supabase client not initialized");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      if (isAdmin && userId && userId !== currentUser?.id) {
        const response = await fetch(`/api/users/${userId}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: data.password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to change password");
        }

        toast.success("Password updated successfully!");
        onPasswordUpdate?.(true, "Password changed successfully");
      } else {
        const { error } = await supabase.auth.updateUser({
          password: data.password,
        });

        if (error) {
          toast.error(error.message || "Failed to change password");

          onPasswordUpdate?.(false, error.message || "Password update failed");
          return;
        }
        onPasswordUpdate?.(true, "Password updated successfully");
      }

      methods.reset();
    } catch (error: any) {
      console.error("Error changing password:", error);
      const errorMessage = error.message || "Failed to change password";
      toast.error(errorMessage);
      onPasswordUpdate?.(false, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: { email: string }) => {
    if (!supabase) {
      toast.error("Supabase client not initialized");
      return;
    }

    setIsResetLoading(true);
    try {
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      toast.success("Password reset email sent. Please check your inbox.");
      resetMethods.reset();
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <Card>
      <Toaster position="top-right" />
      <CardHeader>
        <CardTitle>Password Management</CardTitle>
        <CardDescription>Update or reset your password</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Tabs defaultValue="change">
          <TabsContent value="change">
            <FormProvider {...methods}>
              <div className="space-y-4">
                <FormField
                  control={methods.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  disabled={isLoading || !supabase}
                  className="w-full"
                  onClick={methods.handleSubmit(onPasswordSubmit)}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </FormProvider>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};