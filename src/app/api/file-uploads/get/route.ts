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
      category: category || undefined,
    };

    if (entityType === "user") {
      whereClause.userId = entityId;
    } else if (entityType === "catering") {
      whereClause.cateringRequestId = entityId;
    } else if (entityType === "onDemand") {
      whereClause.onDemandId = entityId;
    } else if (entityType === "jobApplication") {
      whereClause.jobApplicationId = entityId;
    } else {
      console.warn('Unknown entityType:', entityType);
      return NextResponse.json(
        { error: `Invalid entityType: ${entityType}` },
        { status: 400 }
      );
    }

    console.log('Prisma query whereClause:', whereClause);

    const files = await prisma.fileUpload.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: "desc",
      },
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