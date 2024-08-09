// app/api/drivers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB';

export async function GET() {
  const drivers = await prisma.user.findMany({
    where: {
      type: 'driver'
    }
  });
  return NextResponse.json(drivers);
}