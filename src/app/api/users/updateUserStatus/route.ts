import { NextResponse } from "next/server";
import { PrismaClient, users_status, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdateUserStatusBody {
  userId: string;
  newStatus: users_status;
}

// Type guard for users_status
function isValidStatus(status: any): status is users_status {
  return Object.values(users_status).includes(status);
}

export async function PUT(request: Request) {
  let requestBody: Partial<UpdateUserStatusBody> = {};

  try {
    // Validate request content-type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body = await request.json();
    requestBody = body;
    
    const { userId, newStatus } = requestBody;

    // More detailed validation
    const missingFields = [];
    if (!userId) missingFields.push('userId');
    if (!newStatus) missingFields.push('newStatus');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: "Missing required fields", 
          details: {
            missingFields,
            received: { userId, newStatus }
          }
        },
        { status: 400 }
      );
    }

    // Type validation for userId
    if (typeof userId !== 'string') {
      return NextResponse.json(
        { 
          error: "Invalid userId format",
          details: {
            expected: "string",
            received: typeof userId
          }
        },
        { status: 400 }
      );
    }

    // Validate status enum using type guard
    if (!isValidStatus(newStatus)) {
      return NextResponse.json(
        { 
          error: "Invalid status provided",
          details: {
            providedStatus: newStatus,
            validStatuses: Object.values(users_status)
          }
        },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        status: newStatus, // TypeScript now knows this is a valid status
        updated_at: new Date()
      },
      select: {
        id: true,
        status: true,
        updated_at: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "User status updated successfully",
      user: updatedUser
    });

  } catch (error) {
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle "Record not found" error
      if (error.code === 'P2025') {
        return NextResponse.json(
          { 
            error: "User not found",
            details: { userId: requestBody?.userId }
          },
          { status: 404 }
        );
      }
      
      // Handle invalid data error
      if (error.code === 'P2002') {
        return NextResponse.json(
          { 
            error: "Database constraint violation",
            details: error.meta
          },
          { status: 409 }
        );
      }
    }

    // Handle validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { 
          error: "Invalid data provided",
          details: error.message
        },
        { status: 400 }
      );
    }

    // Log the error for debugging
    console.error("Update user status error:", {
      error,
      timestamp: new Date().toISOString(),
      receivedBody: requestBody
    });

    // Generic error response
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}