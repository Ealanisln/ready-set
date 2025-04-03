// src/app/api/addresses/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/utils/prismaDB";
import { AddressFormData } from "@/types/address";

/**
 * GET handler for fetching addresses
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const filterParam = searchParams.get("filter") || "all"; // Options: all, shared, private

    // If requesting a specific address by ID
    if (id) {
      const address = await prisma.address.findUnique({
        where: { id },
      });

      // Check if address exists
      if (!address) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 },
        );
      }

      // Check if user has access to this address
      if (!address.isShared && address.createdBy !== currentUser.id) {
        return NextResponse.json(
          { error: "Unauthorized to access this address" },
          { status: 403 },
        );
      }

      return NextResponse.json(address);
    }

    // Different query strategies based on filter parameter
    const addressesQuery = {
      where: {},
      orderBy: { createdAt: "desc" as const },
    };

    // Build the query based on the filter
    switch (filterParam) {
      case "shared":
        // Only fetch shared addresses
        addressesQuery.where = { isShared: true };
        break;

      case "private":
        // Only fetch user's private addresses
        addressesQuery.where = {
          createdBy: currentUser.id,
          isShared: false,
        };
        break;

      case "all":
      default:
        // Fetch both shared addresses and user's private addresses
        addressesQuery.where = {
          OR: [{ isShared: true }, { createdBy: currentUser.id }],
        };
        break;
    }

    // Execute the query
    const addresses = await prisma.address.findMany(addressesQuery);

    console.log(
      `Found ${addresses.length} addresses for user ${currentUser.id}`,
    );
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

/**
 * POST handler for creating a new address
 */
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const formData: AddressFormData = await request.json();

    // Basic validation
    if (
      !formData.street1 ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    // Create a new address
    const newAddress = {
      ...formData,
      createdBy: currentUser.id,
    };

    console.log("Creating new address:", newAddress);

    const createdAddress = await prisma.address.create({
      data: newAddress,
    });

    // Create userAddress relation to track ownership if it's not shared
    if (!formData.isShared) {
      await prisma.userAddress.create({
        data: {
          userId: currentUser.id,
          addressId: createdAddress.id,
          isDefault: false, // Could be set based on user preferences
        },
      });
    }

    console.log("Created address:", createdAddress);
    return NextResponse.json(createdAddress, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}

/**
 * PUT handler for updating an address
 */
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 },
      );
    }

    // Fetch the address to check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Only allow creator or admin to update
    if (existingAddress.createdBy !== currentUser.id) {
      // Check if user is admin (you need to implement this check)
      const isAdmin = await checkIfUserIsAdmin(currentUser.id);

      if (!isAdmin) {
        return NextResponse.json(
          { error: "Unauthorized to update this address" },
          { status: 403 },
        );
      }
    }

    const formData: Partial<AddressFormData> = await request.json();

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: formData,
    });

    // If the isShared status has changed, update userAddress relations
    if (
      formData.isShared !== undefined &&
      formData.isShared !== existingAddress.isShared
    ) {
      if (formData.isShared) {
        // If now shared, we could remove userAddress relations if desired
      } else {
        // If no longer shared, ensure there's a userAddress relation for the creator
        const userAddressExists = await prisma.userAddress.findFirst({
          where: {
            userId: currentUser.id,
            addressId: id,
          },
        });

        if (!userAddressExists) {
          await prisma.userAddress.create({
            data: {
              userId: currentUser.id,
              addressId: id,
              isDefault: false,
            },
          });
        }
      }
    }

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}

/**
 * DELETE handler for removing an address
 */
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 },
      );
    }

    // Fetch the address to check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Only allow creator or admin to delete
    if (existingAddress.createdBy !== currentUser.id) {
      // Check if user is admin
      const isAdmin = await checkIfUserIsAdmin(currentUser.id);

      if (!isAdmin) {
        return NextResponse.json(
          { error: "Unauthorized to delete this address" },
          { status: 403 },
        );
      }
    }

    // Delete any userAddress relations
    await prisma.userAddress.deleteMany({
      where: { addressId: id },
    });

    // Delete the address
    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}

/**
 * Helper function to check if a user has admin privileges
 */
async function checkIfUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user?.type === "admin" || user?.type === "super_admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
