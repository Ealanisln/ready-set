// app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/utils/auth";

// Helper function to check admin authorization
async function checkAuthorization(requestedUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Allow access if the user is requesting their own profile
  if (session.user.id === requestedUserId) {
    return null;
  }
  
  // Allow access if the user is an admin
  if (session.user.type === 'admin') {
    return null;
  }
  
  // Deny access for all other cases
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// GET: Fetch a user by ID (only id and name)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
  const authResponse = await checkAuthorization(userId);
  if (authResponse) return authResponse;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        contact_name: true,
        email: true,
        contact_number: true,
        type: true,
        company_name: true,
        website: true,
        street1: true,
        street2: true,
        city: true,
        state: true,
        zip: true,
        parking_loading: true,
        counties: true,
        time_needed: true,
        catering_brokerage: true,
        frequency: true,
        provide: true,
        head_count: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Process the user data to match the component's expectations
    const processedUser = {
      ...user,
      displayName: user.type === "driver" ? user.name : user.contact_name,
      countiesServed: user.counties ? user.counties.split(", ") : [],
      timeNeeded: user.time_needed ? user.time_needed.split(", ") : [],
      cateringBrokerage: user.catering_brokerage
        ? user.catering_brokerage.split(", ")
        : [],
      provisions: user.provide ? user.provide.split(", ") : [],
    };

    return NextResponse.json(processedUser);
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

  const authResponse = await checkAuthorization(userId);
  if (authResponse) return authResponse;

  try {
    const data = await request.json();
    console.log("Received data:", data);

    let processedData: any = { ...data };

    // Map fields to match Prisma schema
    if (processedData.countiesServed) {
      processedData.counties = processedData.countiesServed.join(", ");
      delete processedData.countiesServed;
    }
    if (processedData.timeNeeded) {
      processedData.time_needed = processedData.timeNeeded.join(", ");
      delete processedData.timeNeeded;
    }
    if (processedData.cateringBrokerage) {
      processedData.catering_brokerage = processedData.cateringBrokerage.join(", ");
      delete processedData.cateringBrokerage;
    }
    if (processedData.provisions) {
      processedData.provide = processedData.provisions.join(", ");
      delete processedData.provisions;
    }
    if (processedData.displayName) {
      if (processedData.type === 'vendor') {
        processedData.name = processedData.displayName;
        delete processedData.contact_name;
      } else if (processedData.type === 'client') {
        processedData.contact_name = processedData.displayName;
        delete processedData.name;
      } else if (processedData.type === 'driver') {
        processedData.name = processedData.displayName;
        delete processedData.contact_name;
      }
      delete processedData.displayName;
    }

    // Remove any fields that are not in the Prisma schema
    const allowedFields = [
      'name', 'email', 'type', 'company_name', 'contact_name', 'contact_number',
      'website', 'street1', 'street2', 'city', 'state', 'zip', 'location_number',
      'parking_loading', 'counties', 'time_needed', 'catering_brokerage',
      'frequency', 'provide', 'head_count', 'status'
    ];
    Object.keys(processedData).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete processedData[key];
      }
    });

    console.log("Processed data:", processedData);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...processedData,
        updated_at: new Date(),
      },
    });

    console.log("Updated user:", updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    let errorMessage = "Failed to update user";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error message:", error.message);
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
  const session = await getServerSession(authOptions);
  if (!session || session.user.type !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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