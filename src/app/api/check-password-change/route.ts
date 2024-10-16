// src/app/api/check-password-change/route.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    needsPasswordChange: session.user.isTemporaryPassword,
  });
}
