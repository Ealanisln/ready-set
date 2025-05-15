import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { JobApplication } from '@prisma/client';

export async function GET(request: NextRequest) {
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

    // Convert to application objects
    const recentApplications = recentApplicationsData.map(app => {
      return {
        id: app.id,
        name: `${app.firstName} ${app.lastName}`,
        position: app.position,
        status: app.status,
        createdAt: app.createdAt,
        hasResume: app.fileUploads?.some(file => file.category === 'resume') || false,
      };
    });

    // Create response with correct property names
    const stats = {
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