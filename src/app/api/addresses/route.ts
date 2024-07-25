import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { user_id: session.user.id },
    });
    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching addresses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const addressData = await request.json();
    const newAddress = await prisma.address.create({
      data: {
        ...addressData,
        user: { connect: { id: session.user.id } },
      },
    });
    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating address" },
      { status: 500 },
    );
  }
}
