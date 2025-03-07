// src/app/api/profile/check/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';

// Define types based on your Prisma schema
interface UserProfile {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface ProfilesEntry {
  auth_user_id: string;
  name: string;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export async function GET(request: Request) {
  try {
    // Important: Await the createClient() since it returns a Promise
    const supabase = await createClient();
    
    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" }, 
        { status: 401 }
      );
    }
    
    const userId = user.id;
    console.log(`API: Checking profile completion for user ${userId}`);
    
    // Determine if user was authenticated via OAuth
    const isOAuth = user.app_metadata?.provider && 
                   user.app_metadata.provider !== 'email';
    
    // 1. First check if user exists in public.user table
    const { data: publicUserData, error: publicUserError } = await supabase
      .from("user")
      .select("id, type, status")
      .eq("id", userId)
      .limit(1)
      .single();
      
    if (!publicUserError && publicUserData) {
      console.log(`API: User found in public.user table: ${publicUserData.id}`);
      return NextResponse.json({
        needsProfileCompletion: false,
        userType: publicUserData.type,
        userData: user
      });
    }
    
    // 2. Check if user has a profile in the 'profiles' table
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("auth_user_id, type, status")
      .eq("auth_user_id", userId)
      .limit(1)
      .single();
      
    if (!profilesError && profilesData) {
      console.log(`API: User found in profiles table: ${profilesData.auth_user_id}`);
      return NextResponse.json({
        needsProfileCompletion: false,
        userType: profilesData.type,
        userData: user
      });
    }
    
    // 3. Special handling for manual users (not OAuth)
    if (!isOAuth) {
      // For manually created users, determine if they should bypass profile completion
      // This could be based on email domain, role, or other criteria
      const bypassProfiles = process.env.BYPASS_PROFILE_EMAILS || '';
      const bypassDomains = process.env.BYPASS_PROFILE_DOMAINS || '';
      
      const shouldBypass = 
        bypassProfiles.split(',').includes(user.email || '') ||
        bypassDomains.split(',').some(domain => 
          user.email?.endsWith(domain) && domain !== ''
        );
        
      if (shouldBypass) {
        console.log(`API: Manual user with bypass criteria, auto-creating profile`);
        
        // Create basic profiles for the user (both in user and profiles tables)
        await createUserProfile(supabase, userId, user);
        
        return NextResponse.json({
          needsProfileCompletion: false,
          userType: 'client', // Default type for auto-created profiles
          userData: user
        });
      }
    }
    
    // If we reach here, user needs to complete their profile
    console.log(`API: User needs to complete profile: ${userId}, isOAuth: ${isOAuth}`);
    return NextResponse.json({
      needsProfileCompletion: true,
      userType: user.user_metadata?.userType || null,
      userData: user
    });
  } catch (error) {
    console.error("API error checking profile:", error);
    return NextResponse.json(
      { error: "Failed to check profile status" }, 
      { status: 500 }
    );
  }
}

// Helper function to create user profile
async function createUserProfile(
  supabase: SupabaseClient, 
  userId: string, 
  user: any
): Promise<boolean> {
  try {
    // Create entry in public.user table
    const userProfile: UserProfile = {
      id: userId,
      name: user.user_metadata?.full_name || user.user_metadata?.name || (user.email?.split('@')[0] || 'user'),
      email: user.email || '',
      type: 'client', // Default type for manual users
      status: 'active', // Activate immediately
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const { error: userError } = await supabase
      .from('user')
      .insert(userProfile);
      
    if (userError) {
      console.error("Error creating user profile:", userError);
      throw userError;
    }
    
    // Create entry in profiles table
    const profileData: ProfilesEntry = {
      auth_user_id: userId,
      name: userProfile.name,
      type: userProfile.type,
      status: userProfile.status,
      created_at: userProfile.created_at,
      updated_at: userProfile.updated_at
    };
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData);
      
    if (profileError) {
      console.error("Error creating profile:", profileError);
      // Continue anyway since we created the user entry
    }
    
    return true;
  } catch (error) {
    console.error("Failed to create user profile:", error);
    return false;
  }
}