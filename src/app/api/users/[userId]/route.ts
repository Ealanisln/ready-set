// src/app/api/users/[userId]/route.ts 

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { Prisma, UserType, UserStatus as PrismaUserStatus } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { deleteUserFiles } from "@/app/actions/delete-user-files";

type Params = { userId: string };

// GET: Fetch a user by ID (only id and name)
export async function GET(
  request: Request,
  { params }: any
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const userId = params.userId;

    // Verify the current user's permissions
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // Check if the user is requesting their own profile or has admin privileges
    const { data: currentUserData, error: currentUserError } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUserData) {
      return NextResponse.json(
        { error: 'Failed to verify permissions' },
        { status: 500 }
      );
    }

    const isAdmin = currentUserData.type === UserType.ADMIN || currentUserData.type === UserType.SUPER_ADMIN;
    const isSelfProfile = user.id === userId;

    // Users can only view their own profile or admins can view any profile
    if (!isSelfProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view this profile' },
        { status: 403 }
      );
    }

    // Fetch the user profile from the database
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update a user by ID
export async function PUT(
  request: Request,
  { params }: any
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const userId = params.userId;

    // Verify the current user's permissions
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // Check if the user is updating their own profile or has admin privileges
    const { data: currentUserData, error: currentUserError } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUserData) {
      return NextResponse.json(
        { error: 'Failed to verify permissions' },
        { status: 500 }
      );
    }

    const isAdmin = currentUserData.type === UserType.ADMIN || currentUserData.type === UserType.SUPER_ADMIN;
    const isSelfProfile = user.id === userId;

    // Users can only update their own profile or admins can update any profile
    if (!isSelfProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to update this profile' },
        { status: 403 }
      );
    }

    // Get the update data from the request
    const updateData = await request.json();

    // Restrict which fields can be updated based on user type
    const allowedFields = [
      'name',
      'contactNumber',
      'street1',
      'street2',
      'city',
      'state',
      'zip',
      'website',
      'companyName',
    ];

    // If admin, they can update additional fields
    if (isAdmin) {
      allowedFields.push('contactName', 'locationNumber', 'parkingLoading');
    }

    // Filter out fields that cannot be updated
    const sanitizedData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {} as Record<string, any>);

    // Update the user in the database
    const { data, error } = await supabase
      .from('profiles')
      .update(sanitizedData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User profile updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user by ID
export async function DELETE(
  request: Request,
  { params }: any
): Promise<NextResponse> {
  const userId = params.userId;
  
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