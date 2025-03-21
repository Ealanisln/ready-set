// src/app/api/file-uploads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: NextRequest) {
  console.log("File upload API endpoint called");

  try {
    // Parse form data first to avoid issues with error handling
    const formData = await request.formData();
    console.log("Form data keys:", Array.from(formData.keys()));

    // Extract important data from the form
    const file = formData.get("file") as File;
    const entityId = formData.get("entityId") as string;
    let entityType = (formData.get("entityType") as string) || "user"; // Default to "user" if not provided
    const category = (formData.get("category") as string) || "general"; // Default to "general" if not provided

    // Get userId from form data if available (for client-provided userId)
    const formUserId = formData.get("userId") as string;

    // Basic validation
    if (!file) {
      console.log("Missing required field: file");
      return NextResponse.json(
        { error: "Missing required field: file" },
        { status: 400 },
      );
    }

    // Get the Supabase client for auth and storage
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Determine the user ID (prioritize authenticated session, fall back to form data)
    const userId = session?.user?.id || formUserId;

    if (!userId) {
      console.log(
        "No user ID available - both session and form data missing user ID",
      );
      return NextResponse.json(
        {
          error:
            "User ID is required. Please provide a userId or authenticate.",
        },
        { status: 400 },
      );
    }

    // Log parameters for debugging
    console.log("Upload parameters:", {
      userId,
      entityId,
      entityType,
      category,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
    });

    // Get user type for better organization
    let userType = "user"; // Default fallback
    try {
      // Try to get user type from profiles table
      const { data: profileData } = await supabase
        .from("profiles")
        .select("type")
        .eq("auth_user_id", userId)
        .single();

      if (profileData?.type) {
        userType = profileData.type;
        console.log("Found role in profiles table:", userType);
      } else {
        // Try from user table if not found in profiles
        const { data: userData } = await supabase
          .from("user")
          .select("type")
          .eq("id", userId)
          .single();

        if (userData?.type) {
          userType = userData.type;
          console.log("Found role in user table:", userType);
        }
      }
    } catch (err) {
      console.warn("Could not determine user type, using default:", err);
      // Continue with default userType
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;

    // Create a structured path based on entity type
    let filePath = "";
    if (entityType === "catering_request") {
      filePath = `catering/${entityId || userId}/${fileName}`;
    } else if (entityType === "on_demand") {
      filePath = `on_demand/${entityId || userId}/${fileName}`;
    } else {
      // Default to user files path
      filePath = `${userType}/${entityId || userId}/${fileName}`;
    }

    console.log("Uploading file to storage path:", filePath);

    // Upload the file
    const { data: storageData, error: storageError } = await supabase.storage
      .from("fileUploader") // Bucket name
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json(
        { error: `Error uploading ${file.name}: ${storageError.message}` },
        { status: 500 },
      );
    }

    // Get public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from("fileUploader").getPublicUrl(filePath);

    // For debugging - log the URL
    console.log("Generated public URL:", publicUrl);

    // Create record in the file_upload table
    try {
      console.log("Creating database record with fields:", {
        userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: publicUrl,
        entityType,
        entityId,
        category,
      });

      // Check if user exists in database and create if not
      let userExists = null;

      try {
        userExists = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
      } catch (userCheckError) {
        console.error("Error checking user existence:", userCheckError);
      }

      // If user doesn't exist, create a minimal record to satisfy the foreign key constraint
      if (!userExists) {
        console.log(
          `User with ID ${userId} not found in database. Creating minimal user record.`,
        );

        try {
          await prisma.user.create({
            data: {
              id: userId,
              // Add minimal required fields based on your schema
              email: session?.user?.email || `${userId}@placeholder.com`,
              name:
                session?.user?.user_metadata?.name ||
                session?.user?.email?.split("@")[0] ||
                "Anonymous",
              // Add other required fields with default/placeholder values
            },
          });
          console.log(`Created minimal user record for ${userId}`);
        } catch (userCreateError) {
          console.error("Failed to create user record:", userCreateError);
          // If we can't create a user, we'll still try to continue with the file upload
          // The database might reject it, but let's try
        }
      }

      // Prepare specific entity type IDs
      let cateringRequestId = null;
      let onDemandId = null;

      if (
        entityType === "catering_request" &&
        entityId &&
        !isNaN(Number(entityId))
      ) {
        cateringRequestId = BigInt(entityId);
      } else if (
        entityType === "on_demand" &&
        entityId &&
        !isNaN(Number(entityId))
      ) {
        onDemandId = BigInt(entityId);
      }

      // Create the database record using Prisma with explicit timestamp handling
      const fileUpload = await prisma.file_upload.create({
        data: {
          userId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: publicUrl,
          uploadedAt: new Date(),
          updatedAt: new Date(),
          entityType,
          entityId,
          category,
          cateringRequestId,
          onDemandId,
        },
      });

      console.log("Database record created successfully:", fileUpload.id);

      return NextResponse.json({
        success: true,
        file: {
          id: fileUpload.id,
          name: file.name,
          url: publicUrl,
          type: file.type,
          size: file.size,
          entityId,
          entityType,
          category,
        },
      });
    } catch (dbError: any) {
      console.error("Database error:", dbError);

      // More detailed error logging for debugging
      if (dbError.meta) {
        console.error("Database error metadata:", dbError.meta);
      }

      // If the file was uploaded but we couldn't save to the database,
      // include the file URL in the error response so the client still has access to it
      return NextResponse.json(
        {
          error: "Failed to save file metadata to database",
          details: dbError.message || String(dbError),
          code: dbError.code,
          fileUploaded: true,
          fileUrl: publicUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in file upload:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error.message || String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  console.log("File delete API endpoint called");

  try {
    // Parse the request body first to avoid issues with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid request body - JSON parsing failed" },
        { status: 400 },
      );
    }

    const { fileId, userId } = body;

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    // Get the Supabase client
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Get the file record from the database
    const fileRecord = await prisma.file_upload.findUnique({
      where: { id: fileId },
    });

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check user authorization if session exists
    // Allow provided userId or session user, with an optional admin bypass
    const isAuthorized =
      !session || // No session means programmatic access
      session.user.id === fileRecord.userId || // Own file
      userId === fileRecord.userId || // Provided matching userId
      (session.user.role &&
        ["admin", "super_admin"].includes(session.user.role)); // Admin role

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized - you do not own this file" },
        { status: 403 },
      );
    }

    // Extract the file path from the URL
    // This regex matches after "fileUploader/" in the URL
    const fileUrlMatch = fileRecord.fileUrl.match(/fileUploader\/([^?#]+)/);
    const filePath = fileUrlMatch?.[1];

    if (!filePath) {
      console.error(
        "Could not determine file path from URL:",
        fileRecord.fileUrl,
      );
      // Continue to delete database record even if we can't parse the path
    } else {
      // Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from("fileUploader")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        // Continue to delete database record even if storage deletion fails
      }
    }

    // Delete from database
    await prisma.file_upload.delete({
      where: { id: fileId },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        error: "Failed to delete file",
        details: error.message || String(error),
      },
      { status: 500 },
    );
  }
}
