// src/app/api/users/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { createClient } from "@/utils/supabase/server";
import { Prisma } from "@prisma/client"; // Import Prisma types

// Define UserType based on your schema enum
type UserType = "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";
// Define UserStatus based on your schema enum
type UserStatus = "active" | "pending" | "deleted";

// GET: Fetch users with pagination, search, sort, filter
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { type: true },
    });

    if (dbUser?.type !== "admin" && dbUser?.type !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // --- Parse Query Parameters ---
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") as UserStatus | 'all' || "all";
    const typeFilter = searchParams.get("type") as UserType | 'all' || "all";
    const sortField = searchParams.get("sort") || "created_at";
    const sortDirection = searchParams.get("direction") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    // --- Build Prisma Where Clause ---
    let where: Prisma.userWhereInput = {};

    // Search filter (apply across relevant fields)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { contact_name: { contains: search, mode: 'insensitive' } },
        { company_name: { contains: search, mode: 'insensitive' } },
        { contact_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
        // Ensure the statusFilter value is a valid UserStatus
        const validStatuses: UserStatus[] = ["active", "pending", "deleted"];
        if (validStatuses.includes(statusFilter)) {
            where.status = statusFilter;
        }
    }

    // Type filter
    if (typeFilter && typeFilter !== "all") {
        // Ensure the typeFilter value is a valid UserType
        const validTypes: UserType[] = ["vendor", "client", "driver", "admin", "helpdesk", "super_admin"];
        if (validTypes.includes(typeFilter)) {
             where.type = typeFilter;
        }
    }

    // --- Build Prisma OrderBy Clause ---
    let orderBy: Prisma.userOrderByWithRelationInput = {};
     // Basic sorting - adjust field names if necessary (e.g., user.name might not exist directly)
    // Consider how to handle sorting by potentially null fields like 'name' vs 'contact_name'
    if (sortField === 'name') {
      // Sorting by name might need to consider both 'name' and 'contact_name'
      // This simple example sorts by 'name', nulls last
      orderBy = { name: { sort: sortDirection, nulls: 'last' } };
    } else if (sortField === 'email') {
       orderBy = { email: { sort: sortDirection, nulls: 'last' } };
    } else if (sortField === 'type') {
       orderBy = { type: sortDirection };
    } else if (sortField === 'status') {
       orderBy = { status: sortDirection };
    } else { // Default to created_at
       orderBy = { created_at: sortDirection };
    }


    // --- Fetch Data and Count ---
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          // Select only the fields needed for the list view
          id: true,
          name: true,
          email: true,
          type: true,
          contact_name: true,
          contact_number: true,
          status: true,
          created_at: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({ users, totalPages });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST: Create a new user (Keep as is, but ensure auth checks are robust)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { type: true },
    });

    // Allow admin and super_admin to create users
    if (dbUser?.type !== "admin" && dbUser?.type !== "super_admin") {
        return NextResponse.json({ error: "Forbidden: Only admins can create users" }, { status: 403 });
    }


    const data = await request.json();

    // Basic validation (Add more robust validation as needed)
    if (!data.email || !data.type || !data.status) {
         return NextResponse.json({ error: "Missing required fields (email, type, status)" }, { status: 400 });
    }

     // Check if email already exists (important!)
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 }); // 409 Conflict
    }


    // IMPORTANT: Handle password securely if creating users directly
    // This example assumes user creation might happen elsewhere or password is set later
    // If you are setting a password here, HASH IT using a library like bcrypt.
    // DO NOT STORE PLAIN TEXT PASSWORDS.
    // Example: const hashedPassword = await bcrypt.hash(data.password, 10);
    // Then save hashedPassword instead of data.password

    const newUser = await prisma.user.create({
      data: {
        // Map incoming data to your prisma schema fields
        // Ensure all required fields are provided or have defaults
        id: data.id || undefined, // Let Prisma generate if not provided
        guid: data.guid,
        name: data.name,
        email: data.email,
        // password: hashedPassword, // Store hashed password if applicable
        type: data.type,
        status: data.status,
        company_name: data.company_name,
        contact_name: data.contact_name,
        contact_number: data.contact_number,
        website: data.website,
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        location_number: data.location_number,
        parking_loading: data.parking_loading,
        counties: data.counties,
        time_needed: data.time_needed,
        catering_brokerage: data.catering_brokerage,
        frequency: data.frequency,
        provide: data.provide,
        head_count: data.head_count,
        side_notes: data.side_notes,
        isTemporaryPassword: data.isTemporaryPassword, // Handle temporary password flag if needed
        // ... other fields
        // file_uploads: data.file_uploads ? { create: data.file_uploads.map(...) } : undefined, // Handle relations if applicable
      },
      select: { // Select only necessary fields for the response
        id: true,
        name: true,
        email: true,
        type: true,
        status: true,
        created_at: true,
      },
    });
    return NextResponse.json(newUser, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Error creating user:", error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors, e.g., unique constraint violation
        if (error.code === 'P2002') {
            return NextResponse.json({ error: `Unique constraint failed on field(s): ${error.meta?.target}` }, { status: 409 });
        }
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}