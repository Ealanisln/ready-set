import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { ApplicationStatus } from "@/types/job-application";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(
  request: NextRequest, 
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;
    const { status, feedbackNote } = await request.json();

    // Check if user is authorized (admin or helpdesk)
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
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
      
    if (!userProfile || !["ADMIN", "HELPDESK", "SUPER_ADMIN"].includes(userProfile.type)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Validate the input
    if (!Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Find the application to ensure it exists
    const application = await prisma.jobApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );
    }

    // Update the application status
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: {
        status: status as ApplicationStatus,
        // If there's a way to store feedback in your schema, add it here
      }
    });

    return NextResponse.json({
      success: true,
      application: updatedApplication
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}