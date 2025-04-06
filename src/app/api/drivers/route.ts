// app/api/drivers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB';

export async function GET() {
  const drivers = await prisma.profile.findMany({
    where: {
      type: 'DRIVER'
    }
  });
  return NextResponse.json(drivers);
}