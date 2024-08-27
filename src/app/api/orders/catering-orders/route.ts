import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const skip = (page - 1) * limit;
  const status = url.searchParams.get('status');
  const recentOnly = url.searchParams.get('recentOnly') === 'true';

  try {
    let whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const cateringOrders = await prisma.catering_request.findMany({
      where: whereClause,
      skip: recentOnly ? 0 : skip,
      take: recentOnly ? 5 : limit,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    const serializedOrders = cateringOrders.map(order => ({
      ...JSON.parse(JSON.stringify(order, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
      )),
      order_type: 'catering',
    }));

    return NextResponse.json(serializedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching catering orders:", error);
    return NextResponse.json({ message: "Error fetching catering orders" }, { status: 500 });
  }
}