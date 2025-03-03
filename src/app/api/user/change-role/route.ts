import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, users_type } from '@prisma/client';
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    // Check if the user is authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Get the current user's details from the database to check type
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { type: true }
    });

    // Check if the user is a super_admin
    if (currentUser?.type !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized - only super admins can change user roles" }, { status: 403 });
    }

    const { userId, newRole } = await request.json();
    
    // Validate that newRole is a valid users_type
    if (!Object.values(users_type).includes(newRole as users_type)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: { type: newRole as users_type },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Error updating user role' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}