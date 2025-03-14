// src/app/api/users/current-user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { createClient } from "@/utils/supabase/server";

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

    // First try to get the user from the profiles table
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('type, auth_user_id')
      .eq('auth_user_id', user.id)
      .single();

    if (profile) {
      console.log(`[${requestId}] Found user in profiles table:`, profile);
      return NextResponse.json({
        id: user.id,
        email: user.email,
        type: profile.type
      });
    }
    
    // If not found in profiles, check the user table
    try {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { 
          id: true,
          type: true,
          email: true 
        }
      });

      if (userData) {
        console.log(`[${requestId}] Found user in prisma table:`, userData);
        return NextResponse.json(userData);
      }
    } catch (prismaError) {
      console.error(`[${requestId}] Error fetching from Prisma:`, prismaError);
    }

    // If we still can't find a role, check user metadata
    if (user.user_metadata && (user.user_metadata.type || user.user_metadata.role)) {
      console.log(`[${requestId}] Using role from user metadata:`, user.user_metadata);
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
      type: "unknown"
    }, { status: 404 });
  } catch (error) {
    console.error(`[${requestId}] Error fetching current user:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}