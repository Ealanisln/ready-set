import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { ApplicationStatus } from "@/types/job-application";
import { createClient } from "@/utils/supabase/server";

// GET handler for fetching job applications with filters and pagination
export async function GET(request: NextRequest) {
  try {
    // Check if user is authorized (admin or helpdesk)
    const supabase = await createClient();
    
    // const { data: { session } } = await supabase.auth.getSession(); // Deprecated usage
    const { data: { user } } = await supabase.auth.getUser(); // Use getUser() for server-side auth
    
    if (!user) { // Check for user instead of session
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch user profile to check role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('type')
      .eq('email', user.email) // Use user.email
      .single();
      
    if (!userProfile || !["ADMIN", "HELPDESK", "SUPER_ADMIN"].includes(userProfile.type)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Parse URL search params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as ApplicationStatus | null;
    const position = searchParams.get("position");
    const search = searchParams.get("search");
    const statsOnly = searchParams.get("statsOnly") === "true";

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = { deletedAt: null };
    
    if (status) {
      where.status = status;
    }
    
    if (position) {
      where.position = position;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // If statsOnly is true, just return the statistics
    if (statsOnly) {
      // Get total counts by status
      const totalApplications = await prisma.jobApplication.count({
        where: { deletedAt: null }
      });
      
      const pendingApplications = await prisma.jobApplication.count({
        where: { 
          deletedAt: null,
          status: ApplicationStatus.PENDING
        }
      });
      
      const approvedApplications = await prisma.jobApplication.count({
        where: { 
          deletedAt: null,
          status: ApplicationStatus.APPROVED
        }
      });
      
      const rejectedApplications = await prisma.jobApplication.count({
        where: { 
          deletedAt: null,
          status: ApplicationStatus.REJECTED
        }
      });
      
      const interviewingApplications = await prisma.jobApplication.count({
        where: { 
          deletedAt: null,
          status: ApplicationStatus.INTERVIEWING
        }
      });

      // Get applications by position
      const positionCounts = await prisma.jobApplication.groupBy({
        by: ['position'],
        _count: {
          position: true
        },
        where: { deletedAt: null }
      });

      const applicationsByPosition = positionCounts.reduce((acc, curr) => {
        acc[curr.position] = curr._count.position;
        return acc;
      }, {} as Record<string, number>);

      // Get 5 most recent applications
      const recentApplications = await prisma.jobApplication.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      return NextResponse.json({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        interviewingApplications,
        applicationsByPosition,
        recentApplications
      });
    }

    // Get total count for pagination
    const totalCount = await prisma.jobApplication.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch applications with pagination
    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        fileUploads: true
      }
    });

    return NextResponse.json({
      applications,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
} 