// app/api/users/[userId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB';
import { NextRequest, NextFetchEvent } from 'next/server';

// GET: Fetch a user by ID
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

// PUT: Update a user by ID
export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const data = await request.json();
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return NextResponse.json(updatedUser);
}

// DELETE: Delete a user by ID
export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  await prisma.user.delete({
    where: { id: userId },
  });
  return NextResponse.json({ message: 'User deleted' });
}
