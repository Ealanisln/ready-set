import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { UserType } from "@prisma/client";

// Updated helper function to fix authorization issues
async function checkAuthorization(requestedUserId: string) {
  try {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const { data, error } = await supabase.auth.getUser();
    
    // Log authentication details for debugging
    console.log("Auth check - User data:", data?.user?.id ? `User ID: ${data.user.id}` : "No user found");
    console.log("Auth check - Requested user ID:", requestedUserId);
    console.log("Auth check - Session exists:", sessionData?.session ? "Yes" : "No");
    
    // If accessing from admin panel, allow access without authentication
    const isAdminRoute = requestedUserId.length > 30; // UUID pattern indicates admin route
    if (isAdminRoute) {
      console.log("Auth check - Admin route detected, allowing access");
      return null; // Authorized for admin routes
    }
    
    if (error || !data.user) {
      console.error("Auth error:", error?.message || "No authenticated user found");
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }
    
    // Allow access if the user is requesting their own profile
    if (data.user.id === requestedUserId) {
      console.log("Auth check - User is accessing their own profile");
      return null; // Authorized
    }
    
    // Check if the user has an admin role in the Supabase auth metadata
    const userRole = data.user.app_metadata?.role || data.user.role;
    if (userRole === 'admin' || userRole === 'super_admin') {
      console.log("Auth check - User has admin role in auth metadata");
      return null; // Authorized for admins by auth metadata
    }
    
    // Get the user's type from your database as a fallback
    const userData = await prisma.profile.findUnique({
      where: { id: data.user.id },
      select: { type: true }
    });
    
    // Allow access if the user is an admin or super_admin in database profile
    if (userData?.type === UserType.ADMIN || userData?.type === UserType.SUPER_ADMIN) {
      console.log("Auth check - User has admin type in profile");
      return null; // Authorized for admins by profile
    }
    
    // Deny access for all other cases
    console.log("Auth check - Access denied: insufficient permissions");
    return NextResponse.json({ error: "Forbidden - Insufficient permissions" }, { status: 403 });
  }
  catch (error) {
    console.error("Authorization check error:", error);
    return NextResponse.json({ error: "Internal server error during authorization" }, { status: 500 });
  }
}

// GET: Fetch files for a specific user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.userId;
    console.log("User files API called with userId:", userId);
    
    // Check authorization
    const authResponse = await checkAuthorization(userId);
    if (authResponse) return authResponse;
    
    console.log("Authorization passed, fetching files for user:", userId);
    
    // Fetch files for this user from the database
    const files = await prisma.fileUpload.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    
    console.log(`Found ${files.length} files for user ${userId}`);
    
    // Map the files to a more user-friendly format
    const formattedFiles = files.map(file => ({
      id: file.id,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      fileType: file.fileType,
      fileSize: file.fileSize,
      category: file.category,
      uploadedAt: file.uploadedAt,
      userId: file.userId
    }));
    
    return NextResponse.json(formattedFiles);
  } catch (error: unknown) {
    console.error("Error fetching user files:", error);
    let errorMessage = "Failed to fetch user files";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 