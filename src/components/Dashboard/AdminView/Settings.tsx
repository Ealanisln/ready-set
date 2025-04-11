// src/components/Dashboard/AdminView/Settings.tsx
"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "react-hot-toast";
import { UserSettingsTab } from "./UserSettingsTab";
import { createClient } from "@/utils/supabase/client";
import { UserType } from "@/types/user";
import { AccountTab } from "@/components/Dashboard/AdminView/AccountTab";
import { PasswordChange } from "./PasswordChange";

export function SettingsUser() {
  const [activeTab, setActiveTab] = useState<string>("account");
  const [userId, setUserId] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        
        // Get Supabase client
        const supabase = await createClient();
        
        // Get current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("No authenticated user found");
        }
        
        // Get user profile data from database
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("id, type")
          .eq("id", user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setUserId(profileData.id);
        setUserType(profileData.type as UserType);
        setIsSuperAdmin(profileData.type === UserType.SUPER_ADMIN);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Toaster position="top-right" />
      <main className="bg-muted/40 flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="mx-auto w-full max-w-6xl">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              {(userType === UserType.ADMIN || userType === UserType.SUPER_ADMIN) && (
                <TabsTrigger value="admin">Admin Settings</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="account" className="space-y-6">
              <AccountTab userId={userId} />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <PasswordChange userId={userId} />
            </TabsContent>
            
            {(userType === UserType.ADMIN || userType === UserType.SUPER_ADMIN) && (
              <TabsContent value="admin" className="space-y-6">
                <UserSettingsTab 
                  userId={userId} 
                  isSuperAdmin={isSuperAdmin}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
