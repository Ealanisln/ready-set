// src/app/api/users/current-user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { createClient } from "@/utils/supabase/server";
import { UserType, UserStatus } from "@/types/user";

export async function GET(request: Request) {
  // Add request tracking for debugging
  const requestId = Math.random().toString(36).substring(7);
  const url = new URL(request.url);
  console.log(`[${requestId}] API call to /api/users/current-user from ${url.pathname} - Headers:`, 
    Object.fromEntries(request.headers));
  
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log(`[${requestId}] No authenticated user found`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First try to get user from the profile table
    try {
      const userData = await prisma.profile.findUnique({
        where: { id: user.id },
        select: { 
          id: true,
          type: true,
          email: true,
          name: true,
          companyName: true,
          status: true
        }
      });

      if (userData) {
        console.log(`[${requestId}] Found user in profile table:`, userData);
        return NextResponse.json(userData);
      }
    } catch (prismaError) {
      console.error(`[${requestId}] Error fetching from Prisma:`, prismaError);
    }

    // If not found in profile table, fall back to profiles table
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('type, auth_user_id')
      .eq('auth_user_id', user.id)
      .single();

    if (profile) {
      console.log(`[${requestId}] Found user in profiles table:`, profile);
      
      // Optional: Sync the profile record here to match profiles
      try {
        await prisma.profile.upsert({
          where: { id: user.id },
          update: { type: profile.type },
          create: { 
            id: user.id,
            email: user.email || '',
            type: profile.type || UserType.CLIENT,
            status: 'PENDING'
          }
        });
        console.log(`[${requestId}] Synchronized profile record from profiles table`);
      } catch (syncError) {
        console.error(`[${requestId}] Error syncing profile record:`, syncError);
      }
      
      return NextResponse.json({
        id: user.id,
        email: user.email,
        type: profile.type
      });
    }
    
    // If we still can't find a role, check user metadata
    if (user.user_metadata && (user.user_metadata.type || user.user_metadata.role)) {
      console.log(`[${requestId}] Using role from user metadata:`, user.user_metadata);
      
      // Optional: Create profile record from metadata
      try {
        const userType = user.user_metadata.type || user.user_metadata.role;
        await prisma.profile.upsert({
          where: { id: user.id },
          update: { type: userType },
          create: { 
            id: user.id,
            email: user.email || '',
            type: userType || UserType.CLIENT,
            status: 'PENDING'
          }
        });
        console.log(`[${requestId}] Created profile record from metadata`);
      } catch (createError) {
        console.error(`[${requestId}] Error creating profile record:`, createError);
      }
      
      return NextResponse.json({
        id: user.id,
        email: user.email,
        type: user.user_metadata.type || user.user_metadata.role
      });
    }

    // If we got here, we couldn't determine the user's role
    console.log(`[${requestId}] User profile not found for ID: ${user.id}`);
    return NextResponse.json({ 
      error: "User profile not found",
      id: user.id,
      email: user.email,
      type: UserType.CLIENT
    }, { status: 404 });
  } catch (error) {
    console.error(`[${requestId}] Error fetching current user:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}