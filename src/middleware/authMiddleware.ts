// src/middleware/authMiddleware.ts
import { NextResponse } from "next/server";
import { PrismaClient, $Enums } from "@prisma/client";
// Remove static import
// import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function validateAdminRole(request: Request) {
  try {
    // Dynamically import and create Supabase client
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    // Check if the user is authenticated
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.profile.findUnique({
      where: { email: user.email },
      select: { type: true },
    });

    if (!dbUser || (dbUser.type !== $Enums.UserType.ADMIN && dbUser.type !== $Enums.UserType.SUPER_ADMIN && dbUser.type !== $Enums.UserType.HELPDESK)) {
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