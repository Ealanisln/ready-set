// src/app/api/users/[userId]/route.ts 

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { Prisma, UserType } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { deleteUserFiles } from "@/app/actions/delete-user-files";
import { UserType as UserTypeType, UserStatus } from "@/types/user";

// Helper function to check authorization
async function checkAuthorization(requestedUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Allow access if the user is requesting their own profile
  if (user.id === requestedUserId) {
    return null;
  }
  
  // Get the user's type from your database
  const userData = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { type: true }
  });
  
  // Allow access if the user is an admin or super_admin
  if (userData?.type && (userData.type === UserType.ADMIN || userData.type === UserType.SUPER_ADMIN)) {
    return null;
  }
  
  // Deny access for all other cases
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// GET: Fetch a user by ID (only id and name)
export async function GET(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { userId } = params;
  const authResponse = await checkAuthorization(userId);
  if (authResponse) return authResponse;
  
  try {
    // Log the user ID we're trying to fetch
    console.log("Fetching user with ID:", userId);
    
    const user = await prisma.profile.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      console.log("User not found with ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("Found user:", user);
    
    // Process the user data to match the component's expectations
    const processedUser = {
      ...user,
      // Only set displayName if name or contact_name exist
      displayName: user.contactName || user.name || "",
      countiesServed: user.counties ? (typeof user.counties === 'string' ? user.counties.split(",").map((s: string) => s.trim()) : user.counties) : [],
      timeNeeded: user.timeNeeded ? user.timeNeeded.split(",").map((s: string) => s.trim()) : [],
      cateringBrokerage: user.cateringBrokerage
        ? user.cateringBrokerage.split(",").map((s: string) => s.trim())
        : [],
      provisions: user.provide ? user.provide.split(",").map((s: string) => s.trim()) : [],
      location_number: user.locationNumber || "", // Make sure this field is included
    };
    
    console.log("Processed user for response:", processedUser);
    
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
export async function PUT(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { userId } = params;
  const authResponse = await checkAuthorization(userId);
  if (authResponse) return authResponse;
  
  try {
    const data = await request.json();
    console.log("Received update data:", data);
    
    let processedData: any = { ...data };
    
    // Map fields to match Prisma schema
    if (processedData.countiesServed) {
      processedData.counties = processedData.countiesServed.join(",");
      delete processedData.countiesServed;
    }
    
    if (processedData.timeNeeded) {
      processedData.timeNeeded = processedData.timeNeeded.join(",");
      delete processedData.timeNeeded;
    }
    
    if (processedData.cateringBrokerage) {
      processedData.cateringBrokerage = processedData.cateringBrokerage.join(",");
      delete processedData.cateringBrokerage;
    }
    
    if (processedData.provisions) {
      processedData.provide = processedData.provisions.join(",");
      delete processedData.provisions;
    }
    
    if (processedData.displayName) {
      if (processedData.type === UserTypeType.VENDOR) {
        processedData.contactName = processedData.displayName;
      } else if (processedData.type === UserTypeType.CLIENT) {
        processedData.contactName = processedData.displayName;
      } else if (processedData.type === UserTypeType.DRIVER) {
        processedData.name = processedData.displayName;
      }
      delete processedData.displayName;
    }
    
    // Remove any fields that are not in the Prisma schema
    const allowedFields = [
      "name",
      "email",
      "type",
      "companyName",
      "contactName",
      "contactNumber",
      "website",
      "street1",
      "street2",
      "city",
      "state",
      "zip",
      "locationNumber",
      "parkingLoading",
      "counties",
      "timeNeeded",
      "cateringBrokerage",
      "frequency",
      "provide",
      "headCount",
      "status",
    ];
    
    Object.keys(processedData).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete processedData[key];
      }
    });
    
    console.log("Processed data for update:", processedData);
    
    const updatedUser = await prisma.profile.update({
      where: { id: userId },
      data: {
        ...processedData,
        updatedAt: new Date(),
      },
    });
    
    console.log("Updated user:", updatedUser);
    
    // Process the user data to match the component's expectations for the response
    const processedUser = {
      ...updatedUser,
      displayName: updatedUser.contactName || updatedUser.name || "",
      countiesServed: updatedUser.counties ? (typeof updatedUser.counties === 'string' ? updatedUser.counties.split(",").map((s: string) => s.trim()) : updatedUser.counties) : [],
      timeNeeded: updatedUser.timeNeeded ? updatedUser.timeNeeded.split(",").map((s: string) => s.trim()) : [],
      cateringBrokerage: updatedUser.cateringBrokerage
        ? updatedUser.cateringBrokerage.split(",").map((s: string) => s.trim())
        : [],
      provisions: updatedUser.provide ? updatedUser.provide.split(",").map((s: string) => s.trim()) : [],
    };
    
    return NextResponse.json(processedUser);
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
export async function DELETE(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { userId } = params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get the user's type from your database
  const userData = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { type: true }
  });
  
  if (userData?.type && (userData.type !== UserType.ADMIN && userData.type !== UserType.SUPER_ADMIN)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    // First, delete all files associated with the user
    const filesDeletionResult = await deleteUserFiles(userId);
    console.log("Files deletion result:", filesDeletionResult);
    
    // Then, delete the user
    await prisma.profile.delete({
      where: { id: userId },
    });
    
    return NextResponse.json({
      message: "User and associated files deleted",
      filesDeletionResult,
    });
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