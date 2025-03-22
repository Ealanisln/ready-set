// src/app/api/users/[userId]/route.ts 

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { deleteUserFiles } from "@/app/actions/delete-user-files";

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
  // Note: Supabase auth doesn't store user type by default, so we need to fetch it
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { type: true }
  });
  
  // Allow access if the user is an admin or super_admin
  if (userData?.type === "admin" || userData?.type === "super_admin") {
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
    
    const user = await prisma.user.findUnique({
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
      displayName: user.contact_name || user.name || "",
      countiesServed: user.counties ? user.counties.split(",").map(s => s.trim()) : [],
      timeNeeded: user.time_needed ? user.time_needed.split(",").map(s => s.trim()) : [],
      cateringBrokerage: user.catering_brokerage
        ? user.catering_brokerage.split(",").map(s => s.trim())
        : [],
      provisions: user.provide ? user.provide.split(",").map(s => s.trim()) : [],
      location_number: user.location_number || "", // Make sure this field is included
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
      processedData.time_needed = processedData.timeNeeded.join(",");
      delete processedData.timeNeeded;
    }
    
    if (processedData.cateringBrokerage) {
      processedData.catering_brokerage =
        processedData.cateringBrokerage.join(",");
      delete processedData.cateringBrokerage;
    }
    
    if (processedData.provisions) {
      processedData.provide = processedData.provisions.join(",");
      delete processedData.provisions;
    }
    
    if (processedData.displayName) {
      if (processedData.type === "vendor") {
        processedData.contact_name = processedData.displayName;
      } else if (processedData.type === "client") {
        processedData.contact_name = processedData.displayName;
      } else if (processedData.type === "driver") {
        processedData.name = processedData.displayName;
      }
      delete processedData.displayName;
    }
    
    // Remove any fields that are not in the Prisma schema
    const allowedFields = [
      "name",
      "email",
      "type",
      "company_name",
      "contact_name",
      "contact_number",
      "website",
      "street1",
      "street2",
      "city",
      "state",
      "zip",
      "location_number",
      "parking_loading",
      "counties",
      "time_needed",
      "catering_brokerage",
      "frequency",
      "provide",
      "head_count",
      "status",
    ];
    
    Object.keys(processedData).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete processedData[key];
      }
    });
    
    console.log("Processed data for update:", processedData);
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...processedData,
        updated_at: new Date(),
      },
    });
    
    console.log("Updated user:", updatedUser);
    
    // Process the user data to match the component's expectations for the response
    const processedUser = {
      ...updatedUser,
      displayName: updatedUser.contact_name || updatedUser.name || "",
      countiesServed: updatedUser.counties ? updatedUser.counties.split(",").map(s => s.trim()) : [],
      timeNeeded: updatedUser.time_needed ? updatedUser.time_needed.split(",").map(s => s.trim()) : [],
      cateringBrokerage: updatedUser.catering_brokerage
        ? updatedUser.catering_brokerage.split(",").map(s => s.trim())
        : [],
      provisions: updatedUser.provide ? updatedUser.provide.split(",").map(s => s.trim()) : [],
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
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { type: true }
  });
  
  if (userData?.type !== "admin" && userData?.type !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    // First, delete all files associated with the user
    const filesDeletionResult = await deleteUserFiles(userId);
    console.log("Files deletion result:", filesDeletionResult);
    
    // Then, delete the user
    await prisma.user.delete({
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