// src/app/api/job-applications/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { sendEmail } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Create the job application record with all required fields from schema
    const application = await prisma.jobApplication.create({
      data: {
        // Basic Information
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null, // Optional in schema
        position: data.role, // Matches the role field from form

        // Address Information
        addressStreet: data.address.street,
        addressCity: data.address.city,
        addressState: data.address.state,
        addressZip: data.address.zip,

        // Professional Information
        education: data.education,
        workExperience: data.workExperience,
        skills: data.skills, // Array of skills from form
        coverLetter: data.coverLetter || null, // Optional in schema

        // Document URLs from file uploads
        resumeUrl: data.resumeUrl,
        driversLicenseUrl: data.driversLicenseUrl || null,
        insuranceUrl: data.insuranceUrl || null,
        vehicleRegUrl: data.vehicleRegUrl || null,

        // Default status as defined in schema
        status: "pending",

        // File uploads will be automatically linked through their entityId
        fileUploads: {
          connect: [
            // Connect resume file
            data.resumeFileId && {
              id: data.resumeFileId,
            },
            // Connect optional driver documents if provided
            data.driversLicenseFileId && {
              id: data.driversLicenseFileId,
            },
            data.insuranceFileId && {
              id: data.insuranceFileId,
            },
            data.vehicleRegFileId && {
              id: data.vehicleRegFileId,
            },
          ].filter(Boolean), // Remove null values
        },
      },
    });

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "",
      subject: "New Job Application",
      text: `New application received from ${data.firstName} ${data.lastName} for ${data.role} position. Application ID: ${application.id}`,
    });

    return NextResponse.json({
      success: true,
      id: application.id, // Return the ID for updating file entityIds
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
