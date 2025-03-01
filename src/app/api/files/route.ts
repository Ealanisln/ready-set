import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error("[REGISTER] Supabase signup error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Create user in Prisma DB (if you're still maintaining your own user records)
    // You might want to adjust this depending on your application architecture
    try {
      await prisma.user.create({
        data: {
          id: data.user?.id as string,
          email: email,
          name: name,
          // Add any other fields your user model requires
        },
      });
    } catch (dbError) {
      console.error("[REGISTER] Database error:", dbError);
      
      // If there was an error creating the user in your DB, we should clean up
      // the Supabase user to avoid orphaned accounts
      if (data.user?.id) {
        await supabase.auth.admin.deleteUser(data.user.id);
      }
      
      throw dbError;
    }

    console.log(`[REGISTER] Successfully registered user: ${email}`);

    return NextResponse.json({
      user: data.user,
      message: "Registration successful. Please check your email for verification.",
    });

  } catch (error) {
    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[REGISTER] Database error:", {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
      
      // Handle duplicate email
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: "Database error", code: error.code },
        { status: 500 }
      );
    }

    // Handle other errors
    console.error("[REGISTER] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client to prevent connection leaks
    await prisma.$disconnect();
  }
}