import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        company_name: true,
        street1: true,
        street2: true,
        city: true,
        state: true,
        zip: true,
        location_number: true,
        parking_loading: true,
        counties: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const address = {
      id: user.id,
      vendor: user.company_name,
      street1: user.street1,
      street2: user.street2,
      city: user.city,
      state: user.state,
      zip: user.zip,
      location_number: user.location_number,
      parking_loading: user.parking_loading,
      county: user.counties, // Note: This might be a comma-separated string
    };

    return NextResponse.json([address]); // Wrap in array to match expected format
  } catch (error) {
    console.error("Error fetching user address:", error);
    return NextResponse.json(
      { error: "Error fetching user address" },
      { status: 500 },
    );
  }
}