import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, users_type } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { userId, newRole } = await request.json();

  // Validate that newRole is a valid users_type
  if (!Object.values(users_type).includes(newRole as users_type)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: { type: newRole as users_type },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Error updating user role' }, { status: 500 });
  }
}