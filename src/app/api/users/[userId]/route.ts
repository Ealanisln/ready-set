// app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";

// GET: Fetch a user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error("Error fetching user:", error);
    let errorMessage = "Failed to fetch user";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to fetch user", details: errorMessage },
      { status: 500 },
    );
  }
}

// PUT: Update a user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
  try {
    const data = await request.json();

    // Process array fields
    const processedData = {
      ...data,
      counties: Array.isArray(data.countiesServed)
        ? data.countiesServed.join(", ")
        : data.counties,
      time_needed: Array.isArray(data.timeNeeded)
        ? data.timeNeeded.join(", ")
        : data.time_needed,
      catering_brokerage: Array.isArray(data.cateringBrokerage)
        ? data.cateringBrokerage.join(", ")
        : data.catering_brokerage,
      provide: Array.isArray(data.provisions)
        ? data.provisions.join(", ")
        : data.provide,
    };

    // Remove fields that shouldn't be directly updated
    delete processedData.countiesServed;
    delete processedData.timeNeeded;
    delete processedData.cateringBrokerage;
    delete processedData.provisions;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...processedData,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error("Error updating user:", error);

    let errorMessage = "Failed to update user";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: "Failed to update user", details: errorMessage },
      { status: 500 },
    );
  }
}

// DELETE: Delete a user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ message: "User deleted" });
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    let errorMessage = "Failed to delete user";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to delete user", details: errorMessage },
      { status: 500 },
    );
  }
}
