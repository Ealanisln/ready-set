// app/api/user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if email exists and is not null
    if (!session.user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error("Error fetching current user:", error);
    let errorMessage = "Failed to fetch current user";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to fetch current user", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!session.user.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const data = await request.json();
    console.log("Received data:", data);  // Log received data

    // Fetch the current user to get their type
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { type: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare the data for update
    const updateData: any = {};

    // Add other fields
    if (data.email) updateData.email = data.email;
    if (data.allowAdminChanges !== undefined) updateData.allowAdminChanges = data.allowAdminChanges;

    console.log("Update data:", updateData);  // Log update data

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    console.log("Updated user:", updatedUser);  // Log updated user

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Failed to update user", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}