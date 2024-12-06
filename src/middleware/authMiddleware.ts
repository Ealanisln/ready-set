// src/middleware/authMiddleware.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function validateAdminRole(request: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { type: true },
  });

  if (!user || (user.type !== 'admin' && user.type !== 'super_admin')) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // Validation passed
}