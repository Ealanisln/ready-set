import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { JobApplication } from '@prisma/client';

type ApplicationCount = {
  _count: number;
  position: string;
};

export async function GET(request: NextRequest) {
  try {
    // Get applications count by status
    const statusCounts = await prisma.jobApplication.groupBy({
      by: ['status'],
      _count: true,
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Get applications count by position
    const positionCounts = await prisma.jobApplication.groupBy({
      by: ['position'],
      _count: true,
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Format data for frontend visualization
    const byStatus = statusCounts.map(item => ({
      status: item.status,
      count: item._count.id,
    }));

    const byPosition: { position: string; count: number }[] = [];
    positionCounts.forEach((item: ApplicationCount) => {
      byPosition.push({
        position: item.position,
        count: item._count,
      });
    });

    // Get recent applications (last 10)
    const recentApplicationsData = await prisma.jobApplication.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        files: true,
      },
    });

    const recentApplications = recentApplicationsData.map((app: JobApplication & { files: any[] }) => {
      return {
        id: app.id,
        name: `${app.firstName} ${app.lastName}`,
        position: app.position,
        status: app.status,
        createdAt: app.createdAt,
        hasResume: app.files.some(file => file.category === 'RESUME'),
      };
    });

    return NextResponse.json({
      byStatus,
      byPosition,
      recentApplications,
      totalApplications: await prisma.jobApplication.count(),
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application statistics' },
      { status: 500 }
    );
  }
} 