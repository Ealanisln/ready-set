// app/api/dashboard-metrics/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalRevenue, deliveriesRequests, salesTotal, totalVendors] =
      await Promise.all([
        prisma.catering_request.aggregate({
          _sum: {
            order_total: true,
          },
        }),
        prisma.catering_request.count(),
        prisma.catering_request.count({
          where: {
            status: "completed",
          },
        }),
        prisma.user.count({
          where: {
            type: "vendor",
          },
        }),
      ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.order_total?.toNumber() || 0,
      deliveriesRequests,
      salesTotal,
      totalVendors,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
