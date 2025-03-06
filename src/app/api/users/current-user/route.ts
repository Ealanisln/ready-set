// src/app/api/users/current-user/route.ts
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

    // First try to get the user from the profiles table
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('type, auth_user_id')
      .eq('auth_user_id', user.id)
      .single();

    if (profile) {
      console.log("Found user in profiles table:", profile);
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
        console.log("Found user in prisma table:", userData);
        return NextResponse.json(userData);
      }
    } catch (prismaError) {
      console.error("Error fetching from Prisma:", prismaError);
    }

    // If we still can't find a role, check user metadata
    if (user.user_metadata && (user.user_metadata.type || user.user_metadata.role)) {
      console.log("Using role from user metadata:", user.user_metadata);
      return NextResponse.json({
        id: user.id,
        email: user.email,
        type: user.user_metadata.type || user.user_metadata.role
      });
    }

    // If we got here, we couldn't determine the user's role
    return NextResponse.json({ 
      error: "User profile not found",
      id: user.id,
      email: user.email,
      type: "unknown"
    }, { status: 404 });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}