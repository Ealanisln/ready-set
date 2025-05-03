import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobApplicationStats, JobApplication } from '@/types/job-application';

export async function GET(req: NextRequest) {
  try {
    // Count total job applications (not deleted)
    const total = await prisma.jobApplication.count({
      where: { deletedAt: null },
    });

    // Count by status
    const [pending, approved, rejected, interviewing] = await Promise.all([
      prisma.jobApplication.count({
        where: { deletedAt: null, status: 'PENDING' },
      }),
      prisma.jobApplication.count({
        where: { deletedAt: null, status: 'APPROVED' },
      }),
      prisma.jobApplication.count({
        where: { deletedAt: null, status: 'REJECTED' },
      }),
      prisma.jobApplication.count({
        where: { deletedAt: null, status: 'INTERVIEWING' },
      }),
    ]);

    // Group by position
    const byPosition = await prisma.jobApplication.groupBy({
      by: ['position'],
      where: { deletedAt: null },
      _count: { position: true },
    });

    // Convert to { [position]: count }
    const applicationsByPosition: Record<string, number> = {};
    byPosition.forEach((item) => {
      applicationsByPosition[item.position] = item._count.position;
    });

    // Get recent applications
    const recentApplicationsData = await prisma.jobApplication.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        fileUploads: true,
      },
    });

    // Convert to JobApplication[] type
    const recentApplications = recentApplicationsData.map(app => {
      // Use as JobApplication to tell TypeScript we'll handle the conversion
      return app as unknown as JobApplication;
    });

    // Create response with correct property names
    const stats: JobApplicationStats = {
      totalApplications: total,
      pendingApplications: pending,
      approvedApplications: approved,
      rejectedApplications: rejected,
      interviewingApplications: interviewing,
      applicationsByPosition,
      recentApplications,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    // Log error for debugging
    console.error('Failed to fetch job application stats:', error);

    // Return a typed error response
    return NextResponse.json(
      { error: 'Failed to fetch job application stats' },
      { status: 500 }
    );
  }
} 