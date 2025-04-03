import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Helper function to check authorization (re-used from the users/[userId] endpoint)
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

// GET: Fetch files for a specific user
export async function GET(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  try {
    const params = await props.params;
    const { userId } = params;
    
    // Check authorization
    const authResponse = await checkAuthorization(userId);
    if (authResponse) return authResponse;
    
    // Fetch files for this user from the database
    const files = await prisma.file_upload.findMany({
      where: {
        entityId: userId,
        entityType: 'user'
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    
    // Map the files to a more user-friendly format
    const formattedFiles = files.map(file => ({
      id: file.id,
      name: file.fileName,
      url: file.fileUrl,
      type: file.fileType,
      size: file.fileSize,
      category: file.category,
      uploadedAt: file.uploadedAt,
      uploadedBy: file.userId
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