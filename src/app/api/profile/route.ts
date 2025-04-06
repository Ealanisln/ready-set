// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the user's profile from your database
    const userData = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        type: true,
        email: true,
        name: true,
        contactName: true,
        image: true
      }
    });
    
    if (!userData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const { profileData, userTableData } = await request.json();
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase for authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify that the user is creating their own profile
    if (user.id !== profileData.auth_user_id) {
      return NextResponse.json({ error: "Unauthorized to create profile for another user" }, { status: 403 });
    }

    console.log("Creating profile using server-side operations");
    
    // Begin transaction for all database operations
    const result = await prisma.$transaction(async (tx) => {
      try {
        // 1. Insert profile into Supabase profiles table
        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select();
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error(`Profile creation failed: ${profileError.message}`);
        }
        
        console.log("Profile created successfully in Supabase");
        
        // 2. Insert user data into user table
        const { data: userTableResult, error: userTableError } = await supabase
          .from('user')
          .insert(userTableData)
          .select();
          
        if (userTableError) {
          console.error('User record creation error:', userTableError);
          // Continue anyway since profile was created
        } else {
          console.log("User record created successfully in Supabase");
        }
        
        // 3. Update user metadata with role
        const { error: updateError } = await supabase.auth.updateUser({
          data: { role: userTableData.type },
        });
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
          // Continue anyway since critical operations succeeded
        } else {
          console.log("User metadata updated successfully");
        }
        
        return { success: true, profileId: profileData.auth_user_id };
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw txError;
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile created successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error in profile API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}