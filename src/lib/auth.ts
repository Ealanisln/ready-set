// src/lib/auth.ts
import { createClient } from "@/utils/supabase/server";

export async function syncOAuthProfile(userId: string, metadata: any) {
  // This function can be called after OAuth authentication to check if a profile needs to be created
  const supabase = await createClient();

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", userId)
    .single();

  if (existingProfile) {
    // Profile already exists, no need to create
    return { success: true, newProfile: false, profile: existingProfile };
  }

  // Get the OAuth provider information
  const { data } = await supabase.auth.getUser();
  const providerData = data?.user?.app_metadata?.provider;

  if (!providerData) {
    // Not an OAuth user, let them complete profile manually
    return { success: false, newProfile: true, message: "Not an OAuth user" };
  }

  // For OAuth users, we can auto-create a basic profile with default role of 'client'
  // This is optional - you can remove this and force all users to complete their profile
  const { error } = await supabase.from("profiles").insert({
    auth_user_id: userId,
    name: metadata.full_name || metadata.name,
    image: metadata.avatar_url || metadata.picture,
    type: "client", // Default role, they can change it later
    status: "pending",
  });

  if (error) {
    console.error("Error creating profile:", error);
    return { success: false, error };
  }

  return { success: true, newProfile: true };
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();

  // Update user metadata with role
  await supabase.auth.updateUser({
    data: { role },
  });

  return { success: true };
}

export async function getUserRole(userId: string) {
  const supabase = await createClient();

  // First check in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("type")
    .eq("auth_user_id", userId)
    .single();

  if (profile?.type) {
    return profile.type;
  }

  // If not in profiles, check user metadata
  const { data } = await supabase.auth.getUser();
  return data?.user?.user_metadata?.role || null;
}
