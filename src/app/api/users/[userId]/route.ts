// src/app/api/users/[userId]/route.ts 

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { Prisma, UserType, UserStatus as PrismaUserStatus } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { deleteUserFiles } from "@/app/actions/delete-user-files";
import { UserType as UserTypeType, UserStatus, User } from "@/types/user";

// Helper function defined locally to check authorization
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
      // Only set displayName if name or contactName exist
      displayName: user.contactName || user.name || "",
      countiesServed: user.counties ? (typeof user.counties === 'string' ? user.counties.split(",").map((s: string) => s.trim()) : user.counties) : [],
      timeNeeded: user.timeNeeded ? (typeof user.timeNeeded === 'string' ? user.timeNeeded.split(",").filter(Boolean).map((s: string) => s.trim()) : user.timeNeeded) : [],
      cateringBrokerage: user.cateringBrokerage
        ? typeof user.cateringBrokerage === 'string' 
          ? user.cateringBrokerage.split(",").map((s: string) => s.trim())
          : user.cateringBrokerage
        : [],
      provisions: user.provide ? typeof user.provide === 'string' ? user.provide.split(",").map((s: string) => s.trim()) : user.provide : [],
      locationNumber: user.locationNumber || "", // Make sure this field is included
    };
    
    console.log("Processed user for response:", processedUser);
    
    return NextResponse.json(processedUser);
  } catch (error: unknown) {
    // Enhance logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error fetching user ID ${userId}:`, error);
    return NextResponse.json(
      { 
        error: "Failed to fetch user data",
        details: `Error processing request for user ID ${userId}: ${errorMessage}` 
      },
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
    
    console.log("[PUT API - RAW DATA RECEIVED]:", JSON.stringify(data, null, 2));

    let processedData: any = { ...data };
    
    // --- Handle potential snake_case keys from form submission --- 
    if (processedData.time_needed !== undefined) {
        processedData.timeNeeded = processedData.time_needed; // Use snake_case value
        delete processedData.time_needed; // Remove original snake_case key
    }
    if (processedData.head_count !== undefined) {
        // If headCount (camelCase) is NOT present, use head_count value
        if (processedData.headCount === undefined) {
            processedData.headCount = processedData.head_count;
        }
        delete processedData.head_count; // Always remove original snake_case key
    }
    // --- End snake_case handling ---
    
    // Map fields to match Prisma schema
    if (processedData.countiesServed) {
      processedData.counties = processedData.countiesServed.join(",");
      delete processedData.countiesServed;
    }
    
    // Process timeNeeded (now guaranteed to be camelCase if it exists)
    if (processedData.timeNeeded !== undefined) { 
      console.log('[PUT API] Processing timeNeeded:', processedData.timeNeeded);
      if (Array.isArray(processedData.timeNeeded)) {
        const filteredTimeNeeded = processedData.timeNeeded.filter(Boolean);
        processedData.timeNeeded = filteredTimeNeeded.length > 0 ? filteredTimeNeeded.join(",") : null;
      } else if (typeof processedData.timeNeeded === 'string') {
        // Fix: Add explicit type for 's'
        const filteredTimeNeeded = processedData.timeNeeded.split(',').map((s: string) => s.trim()).filter(Boolean);
        processedData.timeNeeded = filteredTimeNeeded.length > 0 ? filteredTimeNeeded.join(",") : null;
      } else {
        processedData.timeNeeded = null; // Default to null if not array or usable string
      }
      console.log('[PUT API] timeNeeded after processing:', processedData.timeNeeded);
    } else {
      console.log('[PUT API] timeNeeded key was not present or usable after mapping.');
      // Explicitly set to null if not provided, ensuring DB consistency
      processedData.timeNeeded = null;
    }

    // Process headCount (now guaranteed to be camelCase if it exists)
    if (processedData.headCount !== undefined) {
      console.log('[PUT API] Processing headCount:', processedData.headCount);
      if (typeof processedData.headCount === 'string') {
        // Keep as string but clean it up
        processedData.headCount = processedData.headCount.trim();
        if (!processedData.headCount) {
          processedData.headCount = null;
        }
      } else if (typeof processedData.headCount === 'number') {
        // Convert number to string
        processedData.headCount = processedData.headCount.toString();
      } else {
        processedData.headCount = null;
      }
      console.log('[PUT API] headCount after processing:', processedData.headCount);
    } else {
        console.log('[PUT API] headCount key was not present or usable after mapping.');
        processedData.headCount = null; // Set to null if not provided
    }
    
    if (processedData.cateringBrokerage) {
        // Ensure it's an array before joining, handle if already string
        if (Array.isArray(processedData.cateringBrokerage)) {
            processedData.cateringBrokerage = processedData.cateringBrokerage.join(",");
        } else if (typeof processedData.cateringBrokerage !== 'string') {
            processedData.cateringBrokerage = null; // Or handle as error
        }
        // If it's already a string, assume it's correct format
    } else {
        processedData.cateringBrokerage = null; // Set to null if empty/missing
    }
    
    if (processedData.provisions) {
      processedData.provide = processedData.provisions.join(",");
      delete processedData.provisions;
    } else {
        processedData.provide = null; // Set related field to null if empty/missing
    }

    // Ensure password fields are deleted
    delete processedData.password; 
    delete processedData.confirmPassword; 
    delete processedData.isTemporaryPassword;

    // Remove fields that are not part of the Prisma schema or are handled separately
    delete processedData.displayName; 

    // --- Uppercase Type and Status for Prisma --- 
    if (processedData.type && typeof processedData.type === 'string') {
        processedData.type = processedData.type.toUpperCase() as UserType;
    } else {
        // Handle cases where type might be missing or invalid - perhaps throw error or delete?
        console.warn('User type is missing or invalid in processed data:', processedData.type);
        delete processedData.type; // Remove invalid type to avoid Prisma error
    }
    if (processedData.status && typeof processedData.status === 'string') {
        processedData.status = processedData.status.toUpperCase() as PrismaUserStatus;
    } else {
         console.warn('User status is missing or invalid in processed data:', processedData.status);
         delete processedData.status; // Remove invalid status
    }
    // --- End Uppercase --- 

    // Clean the data further: Remove disallowed fields
    const allowedFields = [
      "name", "email", "image", "type", "companyName", "contactName", 
      "contactNumber", "website", "street1", "street2", "city", "state", 
      "zip", "locationNumber", "parkingLoading", "counties", "timeNeeded", 
      "cateringBrokerage", "frequency", "provide", "headCount", "status", 
      "sideNotes"
    ];
    Object.keys(processedData).forEach(key => {
      if (!allowedFields.includes(key)) {
        console.log(`Removing disallowed field: ${key}`); // Log removed fields
        delete processedData[key];
      }
    });
    
    // Final check for required fields before update (optional, Prisma might handle)
    if (!processedData.email || !processedData.type) {
        console.error("Missing required fields (email or type) before Prisma update.", processedData);
        throw new Error("Internal error: Missing required fields for update.");
    }
    
    console.log("[PUT API - FINAL DATA TO UPDATE]:", JSON.stringify(processedData, null, 2));

    const updatedUser = await prisma.profile.update({
      where: { id: userId },
      data: processedData,
    });

    console.log("User updated successfully:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    // Provide more context in the error response
    const errorDetails = error instanceof Error ? error.message : "Unknown error during update";
    return NextResponse.json({ error: "Error updating user", details: errorDetails }, { status: 500 });
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