import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { sendEmail } from "@/utils/email";
import { application_status } from "@prisma/client"; // Import the enum type

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Debug log
    console.log("Received data:", JSON.stringify(data, null, 2));

    // Create the job application without file connections first
    const applicationData = {
      // Basic Information
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      position: data.role,

      // Address Information
      addressStreet: data.address.street,
      addressCity: data.address.city,
      addressState: data.address.state,
      addressZip: data.address.zip,

      // Professional Information
      education: data.education,
      workExperience: data.workExperience,
      skills: data.skills,
      coverLetter: data.coverLetter || null,

      // Document URLs from file uploads
      resumeUrl: data.resumeUrl,
      driversLicenseUrl: data.driversLicenseUrl || null,
      insuranceUrl: data.insuranceUrl || null,
      vehicleRegUrl: data.vehicleRegUrl || null,

      // Use the enum type for status
      status: "pending" as application_status,
    };

    console.log("Creating application with data:", JSON.stringify(applicationData, null, 2));

    const application = await prisma.job_application.create({
      data: applicationData,
    });

    // If we have file IDs, update the file records separately
    if (data.resumeFileId || data.driversLicenseFileId || data.insuranceFileId || data.vehicleRegFileId) {
      const fileIds = [
        data.resumeFileId,
        data.driversLicenseFileId,
        data.insuranceFileId,
        data.vehicleRegFileId
      ].filter(Boolean);

      console.log("Updating files with IDs:", fileIds);

      if (fileIds.length > 0) {
        await prisma.file_upload.updateMany({
          where: {
            id: {
              in: fileIds
            }
          },
          data: {
            jobApplicationId: application.id
          }
        });
      }
    }

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "",
      subject: "New Job Application",
      text: `New application received from ${data.firstName} ${data.lastName} for ${data.role} position. Application ID: ${application.id}`,
    });

    return NextResponse.json({
      success: true,
      id: application.id,
    });
  } catch (error: any) {
    console.error("Application submission error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });

    return NextResponse.json(
      { error: "Failed to submit application", details: error.message },
      { status: 500 }
    );
  }
}