import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// TypeScript interface for the stats response
export interface JobApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  applicationsByPosition: Record<string, number>;
}

export async function GET(req: NextRequest) {
  try {
    // Count total job applications (not deleted)
    const total = await prisma.jobApplication.count({
      where: { deletedAt: null },
    });

    // Count by status
    const [pending, approved, rejected] = await Promise.all([
      prisma.jobApplication.count({
        where: { deletedAt: null, status: 'PENDING' },
      }),
      prisma.jobApplication.count({
        where: { deletedAt: null, status: 'APPROVED' },
      }),
      prisma.jobApplication.count({
        where: { deletedAt: null, status: 'REJECTED' },
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

    const stats: JobApplicationStats = {
      total,
      pending,
      approved,
      rejected,
      applicationsByPosition,
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