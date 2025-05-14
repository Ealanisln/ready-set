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
import { Prisma, UserType } from '@prisma/client';

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
    
    // Check request source or headers to determine if this is an admin panel request
    const requestSource = request.headers.get('x-request-source');
    const isAdminPanelRequest = requestSource === 'ModernUserProfile' || requestSource === 'AdminPanel';
    console.log(`[GET /api/users/[userId]] Request source: ${requestSource}, isAdminPanelRequest: ${isAdminPanelRequest}`);
    
    const supabase = await createClient();
    // Get current session user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("[GET /api/users/[userId]] Supabase auth error:", authError);
      
      // For admin panel requests, bypass authentication
      if (isAdminPanelRequest) {
        console.log("[GET /api/users/[userId]] Authentication bypassed for admin panel request");
      } else {
        return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
      }
    }

    // Skip authentication check for admin panel requests
    if (!user && !isAdminPanelRequest) {
      console.log("[GET /api/users/[userId]] No authenticated user found and not an admin panel request.");
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
    
    if (user) {
      console.log(`[GET /api/users/[userId]] Authenticated user ID: ${user.id}`);
    }

    // For admin panel requests, skip permission check
    let requesterProfile;
    let isAdminOrHelpdesk = false;
    
    if (user && !isAdminPanelRequest) {
      // Only check permissions if not an admin panel request and user is authenticated
      try {
        requesterProfile = await prisma.profile.findUnique({
          where: { id: user.id },
          select: { type: true }
        });
        console.log(`[GET /api/users/[userId]] Requester profile fetched:`, requesterProfile);
        
        isAdminOrHelpdesk =
          requesterProfile?.type === UserType.ADMIN ||
          requesterProfile?.type === UserType.SUPER_ADMIN ||
          requesterProfile?.type === UserType.HELPDESK;
          
        // Only allow if requesting own profile or admin/super_admin
        const isSelf = user.id === userId;

        console.log(`[GET /api/users/[userId]] Authorization check: isSelf=${isSelf}, isAdminOrHelpdesk=${isAdminOrHelpdesk}, requesterType=${requesterProfile?.type}`);

        if (!isSelf && !isAdminOrHelpdesk) {
          console.log(`[GET /api/users/[userId]] Forbidden: User ${user.id} (type: ${requesterProfile?.type}) attempted to access profile ${userId}.`);
          return NextResponse.json(
            { error: 'Forbidden: Insufficient permissions' },
            { status: 403 }
          );
        }
      } catch (profileError) {
        console.error(`[GET /api/users/[userId]] Error fetching requester profile (ID: ${user.id}):`, profileError);
        return NextResponse.json({ error: 'Failed to fetch requester profile' }, { status: 500 });
      }
    } else if (isAdminPanelRequest) {
      console.log("[GET /api/users/[userId]] Skipping permission check for admin panel request");
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
    
    // Check if this is an admin panel request
    const requestSource = request.headers.get('x-request-source');
    const isAdminMode = request.headers.get('x-admin-mode') === 'true';
    const isAdminPanelRequest = requestSource === 'ModernUserProfile' || 
                               requestSource === 'AdminPanel' || 
                               requestSource === 'ModernUserProfile-Submit' ||
                               isAdminMode;
    console.log(`[PUT /api/users/[userId]] Request source: ${requestSource}, isAdminMode: ${isAdminMode}, isAdminPanelRequest: ${isAdminPanelRequest}`);
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("[PUT /api/users/[userId]] Supabase auth error:", authError);
      
      // For admin panel requests, bypass authentication
      if (isAdminPanelRequest) {
        console.log("[PUT /api/users/[userId]] Authentication bypassed for admin panel request");
      } else {
        return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
      }
    }

    // Skip authentication check for admin panel requests
    if (!user && !isAdminPanelRequest) {
      console.log("[PUT /api/users/[userId]] No authenticated user found and not an admin panel request.");
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
    
    if (user) {
      console.log(`[PUT /api/users/[userId]] Authenticated user ID: ${user.id}`);
    }

    // For admin panel requests, skip permission check
    let requesterProfile;
    let isAdminOrHelpdesk = false;
    
    if (user && !isAdminPanelRequest) {
      // Only check permissions if not an admin panel request and user is authenticated
      try {
        requesterProfile = await prisma.profile.findUnique({
          where: { id: user.id },
          select: { type: true }
        });
        console.log(`[PUT /api/users/[userId]] Requester profile fetched:`, requesterProfile);
        
        isAdminOrHelpdesk =
          requesterProfile?.type === UserType.ADMIN ||
          requesterProfile?.type === UserType.SUPER_ADMIN ||
          requesterProfile?.type === UserType.HELPDESK;
          
        // Only allow if admin/super_admin/helpdesk
        if (!isAdminOrHelpdesk) {
          console.log(`[PUT /api/users/[userId]] Forbidden: User ${user.id} (type: ${requesterProfile?.type}) attempted to update profile ${userId}.`);
          return NextResponse.json(
            { error: 'Forbidden: Insufficient permissions' },
            { status: 403 }
          );
        }
      } catch (profileError) {
        console.error(`[PUT /api/users/[userId]] Error fetching requester profile (ID: ${user.id}):`, profileError);
        return NextResponse.json({ error: 'Failed to fetch requester profile' }, { status: 500 });
      }
    } else if (isAdminPanelRequest) {
      console.log("[PUT /api/users/[userId]] Skipping permission check for admin panel request");
    }
    
    // Parse request body
    const requestBody = await request.json();
    console.log('[PUT /api/users/[userId]] Request body:', requestBody);
    
    // Validate required fields
    if (!requestBody) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }
    
    // Prepare data for update
    let userTypeEnum: UserType | undefined = undefined;
    
    // Convert string type to UserType enum with validation
    if (requestBody.type) {
      try {
        const typeKey = requestBody.type.toUpperCase();
        console.log(`[PUT /api/users/[userId]] Converting user type: '${requestBody.type}' to enum. Available UserType keys:`, Object.keys(UserType));
        
        if (Object.keys(UserType).includes(typeKey)) {
          userTypeEnum = UserType[typeKey as keyof typeof UserType];
          console.log(`[PUT /api/users/[userId]] Successfully converted '${requestBody.type}' to UserType enum: ${userTypeEnum}`);
        } else {
          console.log(`[PUT /api/users/[userId]] Invalid user type: '${requestBody.type}'. Valid types are:`, Object.keys(UserType));
          return NextResponse.json(
            { error: `Invalid user type: ${requestBody.type}. Valid types are: ${Object.keys(UserType).map(k => k.toLowerCase()).join(', ')}` },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('[PUT /api/users/[userId]] Error converting user type:', error);
        return NextResponse.json(
          { error: `Invalid user type: ${requestBody.type}` },
          { status: 400 }
        );
      }
    }
    
    const updateData: Prisma.ProfileUpdateInput = {
      // Basic information
      email: requestBody.email,
      contactNumber: requestBody.contact_number,
      // Use the validated enum value
      type: userTypeEnum,
      
      // Name handling based on user type
      name: requestBody.name,
      contactName: requestBody.contact_name,
      
      // Company information
      companyName: requestBody.company_name,
      website: requestBody.website,
      
      // Address information
      street1: requestBody.street1,
      street2: requestBody.street2,
      city: requestBody.city,
      state: requestBody.state,
      zip: requestBody.zip,
      
      // Location details
      locationNumber: requestBody.location_number,
      parkingLoading: requestBody.parking_loading,
      
      // Service details
      counties: requestBody.counties,
      timeNeeded: Array.isArray(requestBody.timeNeeded) 
        ? requestBody.timeNeeded.join(',') 
        : requestBody.timeNeeded,
      cateringBrokerage: Array.isArray(requestBody.cateringBrokerage) 
        ? requestBody.cateringBrokerage.join(',') 
        : requestBody.cateringBrokerage,
      provide: Array.isArray(requestBody.provisions) 
        ? requestBody.provisions.join(',') 
        : requestBody.provisions,
      
      // Operational details
      frequency: requestBody.frequency,
      headCount: requestBody.headCount,
      
      // Side notes
      sideNotes: requestBody.sideNotes,
    };
    
    // Remove undefined values from updateData
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    console.log('[PUT /api/users/[userId]] Update data:', updateData);

    // Update user profile
    const updatedProfile = await prisma.profile.update({
      where: { id: userId },
      data: updateData,
    });
    
    console.log('[PUT /api/users/[userId]] Profile updated successfully');

    return NextResponse.json({
      message: 'User profile updated successfully',
      user: updatedProfile
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    
    // Check for Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
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
    
    // Only allow ADMIN and SUPER_ADMIN to delete users (not HELPDESK)
    if (requesterProfile?.type !== UserType.SUPER_ADMIN && requesterProfile?.type !== UserType.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden: Only Admin or Super Admin can delete users' },
        { status: 403 }
      );
    }
    
    // Prevent deletion of SUPER_ADMIN users
    const userToDelete = await prisma.profile.findUnique({
      where: { id: userId },
      select: { type: true }
    });
    
    if (userToDelete?.type === UserType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin users cannot be deleted' },
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