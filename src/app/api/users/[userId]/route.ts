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
  console.log(`[GET /api/users/[userId]] Request received for URL: ${request.url}`);
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("[GET /api/users/[userId]] Supabase auth error:", authError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
    }

    if (!user) {
      console.log("[GET /api/users/[userId]] No authenticated user found.");
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
    console.log(`[GET /api/users/[userId]] Authenticated user ID: ${user.id}`);

    // Fetch requesting user's profile for role
    let requesterProfile;
    try {
      requesterProfile = await prisma.profile.findUnique({
        where: { id: user.id },
        select: { type: true }
      });
      console.log(`[GET /api/users/[userId]] Requester profile fetched:`, requesterProfile);
    } catch (profileError) {
      console.error(`[GET /api/users/[userId]] Error fetching requester profile (ID: ${user.id}):`, profileError);
      return NextResponse.json({ error: 'Failed to fetch requester profile' }, { status: 500 });
    }

    // Only allow if requesting own profile or admin/super_admin
    const isSelf = user.id === userId;
    const isAdminOrHelpdesk =
      requesterProfile?.type === UserType.ADMIN ||
      requesterProfile?.type === UserType.SUPER_ADMIN ||
      requesterProfile?.type === UserType.HELPDESK;

    console.log(`[GET /api/users/[userId]] Authorization check: isSelf=${isSelf}, isAdminOrHelpdesk=${isAdminOrHelpdesk}, requesterType=${requesterProfile?.type}`);

    if (!isSelf && !isAdminOrHelpdesk) {
      console.log(`[GET /api/users/[userId]] Forbidden: User ${user.id} (type: ${requesterProfile?.type}) attempted to access profile ${userId}.`);
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch the target user profile
    let profile;
    try {
      profile = await prisma.profile.findUnique({
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
      console.log(`[GET /api/users/[userId]] Target profile fetched (ID: ${userId}):`, profile ? 'Found' : 'Not Found');
    } catch (targetProfileError) {
      console.error(`[GET /api/users/[userId]] Error fetching target profile (ID: ${userId}):`, targetProfileError);
      return NextResponse.json({ error: 'Failed to fetch target user profile' }, { status: 500 });
    }

    if (!profile) {
      console.log(`[GET /api/users/[userId]] User not found: ID ${userId}`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`[GET /api/users/[userId]] Successfully fetched profile for user ID: ${userId}`);
    
    // Helper to parse comma-separated strings, potentially with extra quotes
    const parseCommaSeparatedString = (value: unknown): string[] => {
      // Ensure the input is a string before processing
      if (typeof value !== 'string' || !value) return [];
      
      // Remove leading/trailing quotes if present (e.g., ""value1, value2"" -> "value1, value2")
      const cleanedStr = value.replace(/^""|""$/g, '');
      return cleanedStr.split(',').map(s => s.trim()).filter(s => s !== ''); // Filter out empty strings
    };

    return NextResponse.json({
      ...profile,
      // Use the helper function to parse counties
      countiesServed: parseCommaSeparatedString(profile.counties),
      timeNeeded: parseCommaSeparatedString(profile.timeNeeded),
      cateringBrokerage: parseCommaSeparatedString(profile.cateringBrokerage),
      provisions: parseCommaSeparatedString(profile.provide)
    });
  } catch (error) {
    console.error('[GET /api/users/[userId]] Unexpected error:', error);
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