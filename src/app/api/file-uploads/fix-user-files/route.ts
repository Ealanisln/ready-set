import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

/**
 * This endpoint is designed to fix user files that were uploaded
 * but don't have the userId field set correctly.
 * 
 * It can be used by admins to repair database inconsistencies.
 */
export async function POST(request: NextRequest) {
  console.log("Fix user files API endpoint called");
  
  // Initialize Prisma client
  const prisma = new PrismaClient();
  
  try {
    // Verify admin permissions
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error("Authentication error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get admin status from database
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { type: true }
    });
    
    if (!profile || !['ADMIN', 'SUPER_ADMIN'].includes(profile.type)) {
      return NextResponse.json({ error: "Admin permission required" }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { userId, entityId, dryRun = true } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    
    // If entityId is provided, fix only files for that entity
    // Otherwise, fix all files that match the pattern for this user
    const whereClause: any = {
      userId: null, // Only fix files with no userId set
    };
    
    // If entityId is provided, use it as an additional filter
    if (entityId) {
      whereClause.fileUrl = { contains: `/user/${entityId}/` };
    } else {
      // Otherwise use the userId to find relevant files
      whereClause.fileUrl = { contains: `/user/${userId}/` };
    }
    
    console.log("Finding files with query:", whereClause);
    
    // Find affected files
    const filesToFix = await prisma.fileUpload.findMany({
      where: whereClause,
      select: {
        id: true,
        fileUrl: true
      }
    });
    
    console.log(`Found ${filesToFix.length} files to fix`);
    
    // If dry run, just return the list of files that would be updated
    if (dryRun) {
      return NextResponse.json({
        message: `Found ${filesToFix.length} files that would be updated (dry run)`,
        filesToFix
      });
    }
    
    // Update the files
    const updates = [];
    for (const file of filesToFix) {
      const update = prisma.fileUpload.update({
        where: { id: file.id },
        data: { userId }
      });
      updates.push(update);
    }
    
    // Execute all updates in parallel
    const results = await Promise.all(updates);
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${results.length} files`,
      updatedFiles: results.map(file => file.id)
    });
  } catch (error: any) {
    console.error("Error fixing user files:", error);
    return NextResponse.json(
      { error: "Failed to fix user files", details: error.message || String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 