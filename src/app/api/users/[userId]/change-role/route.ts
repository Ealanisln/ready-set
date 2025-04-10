import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB';
import { createClient } from '@/utils/supabase/server';
import { UserType } from '@prisma/client';

export async function POST(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { userId } = params;

  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requesterProfile = await prisma.profile.findUnique({
      where: { id: authUser.id },
      select: { type: true },
    });

    if (requesterProfile?.type !== UserType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can change user roles.' },
        { status: 403 }
      );
    }

    if (authUser.id === userId) {
        return NextResponse.json(
            { error: 'Cannot change your own role via this endpoint.' },
            { status: 403 }
        );
    }

    const { newRole } = await request.json();

    // Convert incoming role to uppercase for validation and DB update
    const upperCaseNewRole = typeof newRole === 'string' ? newRole.toUpperCase() : null;

    if (!upperCaseNewRole || !Object.values(UserType).includes(upperCaseNewRole as UserType)) {
      return NextResponse.json(
        { error: 'Invalid role provided' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.profile.update({
      where: { id: userId },
      // Use the validated uppercase role
      data: { type: upperCaseNewRole as UserType },
      select: {
          id: true,
          email: true,
          type: true,
          name: true,
          status: true,
       }
    });

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