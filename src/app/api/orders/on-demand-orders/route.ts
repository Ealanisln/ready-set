import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;
    const status = url.searchParams.get('status');

    let whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const [onDemandOrders, totalCount] = await Promise.all([
      prisma.on_demand.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.on_demand.count({ where: whereClause }),
    ]);

    const serializedOrders = onDemandOrders.map(order => ({
      ...JSON.parse(JSON.stringify(order, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
      )),
      order_type: 'ondemand',
      client_name: order.user.name,
    }));

    return NextResponse.json({
      orders: serializedOrders,
      totalCount,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching on-demand orders:", error);
    return NextResponse.json({ message: "Error fetching on-demand orders" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}