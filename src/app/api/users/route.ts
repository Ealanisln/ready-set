// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB'; 

// GET: Fetch all users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST: Create a new user
export async function POST(request: Request) {
  const data = await request.json();
  const newUser = await prisma.user.create({ data });
  return NextResponse.json(newUser);
}
