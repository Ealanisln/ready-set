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
      where: { createdBy: session.user.id },
      select: {
        id: true,
        name: true,
        street1: true,
        street2: true,
        city: true,
        state: true,
        zip: true,
        locationNumber: true,
        parkingLoading: true,
        county: true,
        isRestaurant: true,
        isShared: true,
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Error fetching addresses: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "An unexpected error occurred while fetching addresses" }, { status: 500 });
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
        createdBy: session.user.id,
        name: data.name,
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        county: data.county,
        locationNumber: data.locationNumber,
        parkingLoading: data.parkingLoading,
        isRestaurant: data.isRestaurant === "on" || data.isRestaurant === true,
        isShared: data.isShared === "on" || data.isShared === true,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json({ error: "Error adding address" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const addressId = url.searchParams.get('id');

  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (address.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json({ error: "Error deleting address" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const addressId = url.searchParams.get('id');

  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
  }

  try {
    const data = await request.json();
    
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (existingAddress.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        name: data.name,
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        county: data.county,
        locationNumber: data.locationNumber,
        parkingLoading: data.parkingLoading,
        isRestaurant: data.isRestaurant,
        isShared: data.isShared,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({ error: "Error updating address" }, { status: 500 });
  }
}