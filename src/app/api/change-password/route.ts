// app/api/change-password/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated or email not found" }, { status: 401 });
  }

  const body = await req.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        isTemporaryPassword: false,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}