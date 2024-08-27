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
    const addresses = await prisma.address.findMany({
      where: { user_id: session.user.id },
      select: {
        id: true,
        vendor: true,
        street1: true,
        street2: true,
        city: true,
        state: true,
        zip: true,
        location_number: true,
        parking_loading: true,
        county: true,
      },
    });

    if (!addresses || addresses.length === 0) {
      return NextResponse.json(
        { error: "No addresses found" },
        { status: 404 },
      );
    }

    // Transform the data to match the Address interface
    const transformedAddresses = addresses.map((address) => ({
      id: address.id.toString(), // Convert BigInt to string
      vendor: address.vendor || "",
      street1: address.street1 || "",
      street2: address.street2 || null,
      city: address.city || "",
      state: address.state || "",
      zip: address.zip || "",
      location_number: address.location_number || null,
      parking_loading: address.parking_loading || null,
      county: address.county || "",
    }));

    return NextResponse.json(transformedAddresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Error fetching addresses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newAddress = await prisma.address.create({
      data: {
        user_id: session.user.id,
        county: data.county,
        vendor: data.company || data.vendor, // Handle both cases
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        location_number: data.location_number,
        parking_loading: data.parking_loading,
      },
    });

    // Convert BigInt to string before sending the response
    const serializedAddress = {
      ...newAddress,
      id: newAddress.id.toString(), // Convert BigInt to string
    };

    return NextResponse.json(serializedAddress, { status: 201 });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      { error: "Error adding address" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Extract the address ID from the URL
  const url = new URL(request.url);
  const addressId = url.searchParams.get('id');

  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
  }

  try {
    // Safely convert addressId to BigInt
    let bigIntId: bigint;
    try {
      bigIntId = BigInt(addressId);
    } catch (error) {
      console.error("Error converting addressId to BigInt:", error);
      return NextResponse.json({ error: "Invalid address ID format" }, { status: 400 });
    }

    const address = await prisma.address.findUnique({
      where: { id: bigIntId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (address.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.address.delete({
      where: { id: bigIntId },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Error deleting address" },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Extract the address ID from the URL
  const url = new URL(request.url);
  const addressId = url.searchParams.get('id');

  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
  }

  try {
    const data = await request.json();
    
    // First, check if the address exists and belongs to the user
    const existingAddress = await prisma.address.findUnique({
      where: { id: BigInt(addressId) },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (existingAddress.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: BigInt(addressId) },
      data: {
        county: data.county,
        vendor: data.company || data.vendor, // Handle both cases
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        location_number: data.location_number,
        parking_loading: data.parking_loading,
      },
    });

    // Convert BigInt to string before sending the response
    const serializedAddress = {
      ...updatedAddress,
      id: updatedAddress.id.toString(), // Convert BigInt to string
    };

    return NextResponse.json(serializedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Error updating address" },
      { status: 500 }
    );
  }
}