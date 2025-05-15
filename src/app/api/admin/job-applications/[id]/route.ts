import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { createClient } from "@/utils/supabase/server";
import { PrismaTransaction } from "@/types/prisma-types";

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;

    // Check if user is authorized (admin or super_admin only)
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch user profile to check role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('type')
      .eq('email', user.email)
      .single();
    
    const userType = userProfile?.type?.toUpperCase() || '';
      
    if (!userProfile || !["ADMIN", "SUPER_ADMIN"].includes(userType)) {
      return NextResponse.json(
        { error: "Forbidden - Only admins can delete job applications" },
        { status: 403 }
      );
    }

    // Find the application to ensure it exists
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: { fileUploads: true }
    });

    if (!application) {
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );
    }

    // Begin a transaction to delete both the application and associated files
    const result = await prisma.$transaction(async (tx: PrismaTransaction) => {
      // First delete all associated file uploads
      if (application.fileUploads && application.fileUploads.length > 0) {
        await tx.fileUpload.deleteMany({
          where: {
            jobApplicationId: id
          }
        });
      }

      // Then soft delete the job application
      const deletedApplication = await tx.jobApplication.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      });

      return deletedApplication;
    });

    return NextResponse.json({
      success: true,
      message: "Job application deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return NextResponse.json(
      { error: "Failed to delete job application" },
      { status: 500 }
    );
  }
} 