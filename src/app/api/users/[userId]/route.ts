// app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";

// GET: Fetch a user by ID (only id and name)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        name: true,
        contact_name: true,
        type: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine which name to use based on user type
    let displayName = user.name;
    if ((user.type === 'vendor' || user.type === 'client') && user.contact_name) {
      displayName = user.contact_name;
    }

    return NextResponse.json({
      id: user.id,
      name: displayName
    });
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

    let processedData = { ...data };

    // Handle name fields based on user type
    if (data.type === "driver") {
      if (data.name) {
        processedData.name = data.name;
      }
      delete processedData.contact_name;
    } else if (data.type === "vendor" || data.type === "client") {
      if (data.contact_name) {
        processedData.contact_name = data.contact_name;
      }
      delete processedData.name;
    }
    // Process array fields
    processedData.counties = data.countiesServed
      ? data.countiesServed.join(", ")
      : "";
    processedData.time_needed = data.timeNeeded
      ? data.timeNeeded.join(", ")
      : "";
    processedData.catering_brokerage = data.cateringBrokerage
      ? data.cateringBrokerage.join(", ")
      : "";
    processedData.provide = data.provisions ? data.provisions.join(", ") : "";

    // Remove fields that shouldn't be directly updated
    delete processedData.countiesServed;
    delete processedData.timeNeeded;
    delete processedData.cateringBrokerage;
    delete processedData.provisions;
    delete processedData.id; // Ensure we're not trying to update the ID

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
