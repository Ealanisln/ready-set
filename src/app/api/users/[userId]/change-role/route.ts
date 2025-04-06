import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

enum UserType {
  vendor = 'vendor',
  client = 'client',
  driver = 'driver',
  admin = 'admin',
  helpdesk = 'helpdesk',
  super_admin = 'super_admin'
}

export async function POST(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const { userId } = params;
    const { newRole } = await request.json();

    // Validate the new role
    if (!Object.values(UserType).includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role provided' },
        { status: 400 }
      );
    }

    // Update the user's role in the database
    const updatedUser = await prisma.profile.update({
      where: { id: userId },
      data: { type: newRole },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User role updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error changing user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}