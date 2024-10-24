import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/utils/auth";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    // Validate required parameters
    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Fetch files from database using prisma
    const files = await prisma.file_upload.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        uploadedAt: 'desc'
      },
    });

    // Log the query results
    console.log(`[FILES_GET] Found ${files.length} files for ${entityType} ${entityId}`);

    // Return the files
    return NextResponse.json({
      files,
      count: files.length
    });

  } catch (error) {
    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[FILES_GET] Database error:", {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
      
      return NextResponse.json(
        { error: "Database error", code: error.code },
        { status: 500 }
      );
    }

    // Handle other errors
    console.error("[FILES_GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Use prisma transaction to ensure data consistency
    const deletedFile = await prisma.$transaction(async (tx) => {
      // First check if file exists and user has permission
      const file = await tx.file_upload.findUnique({
        where: { id: fileId }
      });

      if (!file) {
        throw new Error("File not found");
      }

      if (file.userId !== session.user.id) {
        throw new Error("Unauthorized");
      }

      // Then delete the file
      return tx.file_upload.delete({
        where: { id: fileId }
      });
    });

    console.log(`[FILES_DELETE] Successfully deleted file ${fileId}`);

    return NextResponse.json({
      message: "File deleted successfully",
      file: deletedFile
    });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[FILES_DELETE] Database error:", {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
      
      return NextResponse.json(
        { error: "Database error", code: error.code },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      if (error.message === "File not found") {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
    }

    console.error("[FILES_DELETE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileId, ...updateData } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Use prisma transaction for updating file metadata
    const updatedFile = await prisma.$transaction(async (tx) => {
      // First check if file exists and user has permission
      const existingFile = await tx.file_upload.findUnique({
        where: { id: fileId }
      });

      if (!existingFile) {
        throw new Error("File not found");
      }

      if (existingFile.userId !== session.user.id) {
        throw new Error("Unauthorized");
      }

      // Then update the file
      return tx.file_upload.update({
        where: { id: fileId },
        data: updateData
      });
    });

    console.log(`[FILES_UPDATE] Successfully updated file ${fileId}`);

    return NextResponse.json(updatedFile);

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[FILES_UPDATE] Database error:", {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
      
      return NextResponse.json(
        { error: "Database error", code: error.code },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      if (error.message === "File not found") {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
    }

    console.error("[FILES_UPDATE] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}