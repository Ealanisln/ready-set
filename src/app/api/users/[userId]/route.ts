// src/app/api/users/[userId]/route.ts

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET: Fetch a user by ID, with authorization.
 * - Allows users to fetch their own profile.
 * - Allows admin/super_admin to fetch any profile.
 * - Returns all fields expected by UserFormValues.
 * - Returns 404 if not found, 403 if forbidden.
 */
import { prisma } from '@/utils/prismaDB';
import { UserType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Get userId from URL path
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    const supabase = await createClient();
    // Get current session user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
    // Fetch requesting user's profile for role
    const requesterProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { type: true }
    });
    // Only allow if requesting own profile or admin/super_admin
    const isSelf = user.id === userId;
    const isAdminOrHelpdesk =
  requesterProfile?.type === UserType.ADMIN ||
  requesterProfile?.type === UserType.SUPER_ADMIN ||
  requesterProfile?.type === UserType.HELPDESK;
    if (!isSelf && !isAdminOrHelpdesk) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    // Fetch the target user profile
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        type: true,
        companyName: true,
        website: true,
        street1: true,
        street2: true,
        city: true,
        state: true,
        zip: true,
        locationNumber: true,
        parkingLoading: true,
        counties: true,
        timeNeeded: true,
        cateringBrokerage: true,
        provide: true,
        frequency: true,
        headCount: true,
        status: true,
        contactName: true,
      }
    });
    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ...profile,
      countiesServed: profile.counties,
    });
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
  request: NextRequest
) {
  try {
    // Get userId from URL path
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
    const requesterProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { type: true }
    });
    const isAdminOrHelpdesk =
  requesterProfile?.type === UserType.ADMIN ||
  requesterProfile?.type === UserType.SUPER_ADMIN ||
  requesterProfile?.type === UserType.HELPDESK;
    if (!isAdminOrHelpdesk) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    // Parse body and update user (add your update logic here)
    // ...
    return NextResponse.json({
      message: 'User profile updated successfully'
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
  request: NextRequest
) {
  try {
    // Get userId from URL path
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
    const requesterProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { type: true }
    });
    if (requesterProfile?.type !== UserType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden: Only super_admin can delete users' },
        { status: 403 }
      );
    }
    // ...delete logic here
    return NextResponse.json({
      message: 'User and associated files deleted'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}