import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId");
    const entityType = searchParams.get("entityType") || "user";
    const category = searchParams.get("category");

    console.log('GET /api/file-uploads/get - Request params:', {
      entityId,
      entityType,
      category
    });

    if (!entityId) {
      console.log('Missing entityId parameter');
      return NextResponse.json(
        { error: "Entity ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = {
      entityId,
      entityType,
    };

    if (category) {
      whereClause.category = category;
    }

    console.log('Prisma query whereClause:', whereClause);

    const files = await prisma.file_upload.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: "desc",
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
        entityId: true,
        category: true,
        uploadedAt: true,
      }
    });

    console.log('Found files:', files);

    return NextResponse.json({
      success: true,
      files: files.map((file) => ({
        key: file.id,
        name: file.fileName,
        url: file.fileUrl,
        type: file.fileType,
        size: file.fileSize,
        entityId: file.entityId,
        category: file.category,
        uploadedAt: file.uploadedAt,
      })),
    });
  } catch (error) {
    console.error("Error retrieving files:", error);
    return NextResponse.json(
      { error: "Failed to retrieve files" },
      { status: 500 }
    );
  }
} 