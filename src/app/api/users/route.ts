// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/utils/auth";

// GET: Fetch all users
export async function GET() {
  try {
    // Check if the user is authenticated and authorized
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        type: true,
        company_name: true,
        contact_name: true,
        contact_number: true,
        website: true,
        street1: true,
        street2: true,
        city: true,
        state: true,
        zip: true,
        location_number: true,
        parking_loading: true,
        counties: true,
        time_needed: true,
        catering_brokerage: true,
        frequency: true,
        provide: true,
        head_count: true,
        photo_vehicle: true,
        photo_license: true,
        photo_insurance: true,
        status: true,
        side_notes: true,
        created_at: true,
        updated_at: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(request: Request) {
  try {
    // Check if the user is authenticated and authorized
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const newUser = await prisma.user.create({ 
      data,
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        status: true,
        created_at: true,
      }
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}