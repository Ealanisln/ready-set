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
    
    // Check if user has a profile in the 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, type")
      .eq("id", userId)
      .single();
      
    if (!profileError && profileData && profileData.type) {
      console.log(`API: User found in profiles table: ${profileData.id}`);
      return NextResponse.json({
        needsProfileCompletion: false,
        userType: profileData.type,
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
        
        // Create basic profile for the user
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
    // Create entry in profiles table
    const profileData = {
      id: userId,
      name: user.user_metadata?.full_name || user.user_metadata?.name || (user.email?.split('@')[0] || 'user'),
      email: user.email || '',
      type: 'client', // Default type for manual users
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData);
      
    if (profileError) {
      console.error("Error creating profile:", profileError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to create user profile:", error);
    return false;
  }
}