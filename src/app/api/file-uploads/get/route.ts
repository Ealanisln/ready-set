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

    // Build where clause for DB query
    const whereClause: any = {};

    // Handle category normalization
    if (category) {
      // Map category variations to consistent values
      const normalizedCategory = category.toLowerCase();
      whereClause.category = normalizedCategory;
    }

    // Handle entity type normalization
    const normalizedEntityType = entityType.toLowerCase();
    console.log('Normalized entity type:', normalizedEntityType);
    
    // Critical fix: If category is catering-order and entityType is user, we need to query by cateringRequestId
    if (category?.toLowerCase() === "catering-order") {
      // For catering orders, regardless of entityType parameter, use cateringRequestId
      whereClause.cateringRequestId = entityId;
      console.log('Using cateringRequestId for catering-order category');
    } else if (normalizedEntityType === "user") {
      whereClause.userId = entityId;
    } else if (normalizedEntityType === "catering" || normalizedEntityType === "catering-order") {
      whereClause.cateringRequestId = entityId;
    } else if (normalizedEntityType === "on_demand" || normalizedEntityType === "ondemand") {
      whereClause.onDemandId = entityId;
    } else if (normalizedEntityType === "job_application" || normalizedEntityType === "jobapplication") {
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