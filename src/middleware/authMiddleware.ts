// src/middleware/authMiddleware.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function validateAdminRole(request: Request) {
  try {
    // Create Supabase client
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    // Check if the user is authenticated
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { type: true },
    });

    if (!dbUser || (dbUser.type !== 'admin' && dbUser.type !== 'super_admin')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null; // Validation passed
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}