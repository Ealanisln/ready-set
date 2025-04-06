// app/api/dashboard-metrics/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalRevenue, deliveriesRequests, salesTotal, totalVendors] =
      await Promise.all([
        prisma.cateringRequest.aggregate({
          _sum: {
            orderTotal: true,
          },
        }),
        prisma.cateringRequest.count(),
        prisma.cateringRequest.count({
          where: {
            status: "COMPLETED",
          },
        }),
        prisma.profile.count({
          where: {
            type: "VENDOR",
          },
        }),
      ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.orderTotal?.toNumber() || 0,
      deliveriesRequests,
      salesTotal,
      totalVendors,
    });
  } catch (error: any) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 });
  }
}
