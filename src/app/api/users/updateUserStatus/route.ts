import { NextResponse } from "next/server";
import { PrismaClient, users_status } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, newStatus } = body;

    if (!userId || !newStatus) {
      return NextResponse.json(
        { error: "Missing required fields", missingFields: ['userId', 'newStatus'].filter(field => !body[field]) },
        { status: 400 }
      );
    }

    // Validate that newStatus is a valid users_status
    if (!Object.values(users_status).includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        status: newStatus as users_status,
        updated_at: new Date()
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User status updated successfully", user: updatedUser },
      { status: 200 }
    );

  } catch (error) {
    console.error("Update user status error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}