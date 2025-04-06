// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { prisma } from "@/utils/prismaDB";

// Schema for validation
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate the request body
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 },
      );
    }

    const { email, password, name } = validation.data;

    // Create Supabase server client
    const supabase = await createClient();

    // Check if user exists in Prisma
    const existingUser = await prisma.profile.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Sign up the user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json(
        { message: authError.message || "Failed to create user" },
        { status: 500 },
      );
    }

    // If Supabase confirms the user or requires email confirmation
    if (authData.user) {
      // Create user in Prisma
      const user = await prisma.profile.create({
        data: {
          id: authData.user.id,
          email,
          name,
        },
      });

      return NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          message: "User created successfully. Please verify your email.",
        },
        { status: 201 },
      );
    }

    // This shouldn't happen if the authData.user exists
    return NextResponse.json(
      { message: "Failed to create user in Supabase" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
