// src/app/api/user/delete-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if the user is authenticated
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the current user's details from the database to check type
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { type: true }
    });
    
    // Check if the user is a super_admin
    if (currentUser?.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }
    
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Using a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // 1. Handle dispatch records manually
      await tx.dispatch.deleteMany({
        where: {
          OR: [{ driverId: id }, { userId: id }],
        },
      });
      
      // 2. Update file uploads to null out the userId
      await tx.file_upload.updateMany({
        where: { userId: id },
        data: { userId: null },
      });
      
      // 3. Handle any addresses created by this user that might be used by others
      // Get addresses created by this user
      const createdAddresses = await tx.address.findMany({
        where: { createdBy: id },
        include: {
          userAddresses: true,
          pickupRequests: true,
          deliveryRequests: true,
          onDemandsPickup: true,
          onDemandsDelivery: true,
        }
      });
      
      // For each address, check if it's used by others
      for (const address of createdAddresses) {
        const isUsedByOthers = 
          address.userAddresses.some(ua => ua.userId !== id) ||
          address.pickupRequests.length > 0 ||
          address.deliveryRequests.length > 0 ||
          address.onDemandsPickup.length > 0 ||
          address.onDemandsDelivery.length > 0;
        
        if (!isUsedByOthers) {
          // Delete unused addresses
          await tx.address.delete({
            where: { id: address.id }
          });
        } else {
          // Null out the createdBy field for addresses used by others
          await tx.address.update({
            where: { id: address.id },
            data: { createdBy: null }
          });
        }
      }
      
      // 4. Delete the user from public schema (will cascade to most relationships)
      await tx.user.delete({
        where: { id },
      });
    });
    
    // Note: Since we don't have direct access to auth.users or the mapping table through Prisma,
    // we would need to handle this differently, possibly through a direct database call or a
    // separate API endpoint for Supabase Auth.
    
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error: "Failed to delete user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}