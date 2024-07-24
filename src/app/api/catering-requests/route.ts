// src/app/api/catering-requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { CateringRequestFormData } from '@/types/catering';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const cateringData: CateringRequestFormData = await request.json();
  
  try {
    const newCateringRequest = await prisma.catering_request.create({
      data: {
        user: { connect: { id: session.user.id } },
        address: { connect: { id: BigInt(cateringData.address_id) } },
        // ... other fields ...
      },
    });
    return NextResponse.json(newCateringRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating catering request:', error);
    return NextResponse.json({ error: 'Error creating catering request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const cateringRequests = await prisma.catering_request.findMany({
      where: { user_id: session.user.id },
      include: { address: true },
    });
    return NextResponse.json(cateringRequests);
  } catch (error) {
    console.error('Error fetching catering requests:', error);
    return NextResponse.json({ error: 'Error fetching catering requests' }, { status: 400 });
  }
}