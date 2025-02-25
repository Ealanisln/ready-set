//src/app/api/users/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { createClient } from "@/utils/supabase/server";

// GET: Fetch all users
export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's type from your database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { type: true }
    });

    // Check if user is admin or super_admin
    if (userData?.type !== "admin" && userData?.type !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        guid: true,
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
        status: true,
        side_notes: true,
        created_at: true,
        updated_at: true,
        file_uploads: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileUrl: true,
            category: true,
          },
        },
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST: Create a new user
export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's type from your database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { type: true }
    });

    // Check if user is admin
    if (userData?.type !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const newUser = await prisma.user.create({
      data: {
        ...data,
        file_uploads: {
          create: data.file_uploads?.map((file: any) => ({
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            fileUrl: file.fileUrl,
            entityType: "user",
            category: file.category,
          })),
        },
      },
      select: {
        id: true,
        guid: true,
        name: true,
        email: true,
        type: true,
        status: true,
        created_at: true,
        file_uploads: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileUrl: true,
            category: true,
          },
        },
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}