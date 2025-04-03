import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { Resend } from 'resend';
import { application_status } from "@prisma/client"; // Import the enum type

// Initialize Resend with proper error handling
let resend: Resend | null = null;
try {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set in environment variables");
  } else {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.error("Failed to initialize Resend client:", error);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Debug log
    console.log("Received data:", JSON.stringify(data, null, 2));

    // Create the job application
    const applicationData = {
      // Basic Information
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      position: data.position,

      // Address Information
      addressStreet: data.addressStreet,
      addressCity: data.addressCity,
      addressState: data.addressState,
      addressZip: data.addressZip,

      // Professional Information
      education: data.education,
      workExperience: data.workExperience,
      skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
      coverLetter: data.coverLetter || null,

      // Document URLs from file uploads
      resumeUrl: data.resumeUrl || "",
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

    // Update file associations if we have file URLs
    if (data.resumeUrl || data.driversLicenseUrl || data.insuranceUrl || data.vehicleRegUrl) {
      const fileUpdates = [];

      if (data.resumeUrl) {
        fileUpdates.push(
          prisma.file_upload.updateMany({
            where: {
              fileUrl: data.resumeUrl,
              entityType: "job_application",
              entityId: data.tempEntityId,
            },
            data: {
              jobApplicationId: application.id,
              isTemporary: false,
              entityId: application.id,
            },
          })
        );
      }

      if (data.driversLicenseUrl) {
        fileUpdates.push(
          prisma.file_upload.updateMany({
            where: {
              fileUrl: data.driversLicenseUrl,
              entityType: "job_application",
              entityId: data.tempEntityId,
            },
            data: {
              jobApplicationId: application.id,
              isTemporary: false,
              entityId: application.id,
            },
          })
        );
      }

      if (data.insuranceUrl) {
        fileUpdates.push(
          prisma.file_upload.updateMany({
            where: {
              fileUrl: data.insuranceUrl,
              entityType: "job_application",
              entityId: data.tempEntityId,
            },
            data: {
              jobApplicationId: application.id,
              isTemporary: false,
              entityId: application.id,
            },
          })
        );
      }

      if (data.vehicleRegUrl) {
        fileUpdates.push(
          prisma.file_upload.updateMany({
            where: {
              fileUrl: data.vehicleRegUrl,
              entityType: "job_application",
              entityId: data.tempEntityId,
            },
            data: {
              jobApplicationId: application.id,
              isTemporary: false,
              entityId: application.id,
            },
          })
        );
      }

      if (fileUpdates.length > 0) {
        await Promise.all(fileUpdates);
      }
    }

    // Send notification email to admin using Resend
    if (resend && process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: 'Ready Set <notifications@ready-set.com>',
          to: process.env.ADMIN_EMAIL,
          subject: "New Job Application",
          html: `
            <h2>New Job Application Received</h2>
            <p><strong>Applicant:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Position:</strong> ${data.position}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Application ID:</strong> ${application.id}</p>
          `,
        });
        console.log("Notification email sent successfully");
      } catch (emailError: any) {
        console.error("Error sending email:", {
          message: emailError.message,
          code: emailError.code,
          details: emailError.errors
        });
        // Don't fail the application submission if email fails
      }
    } else {
      console.warn("Email notification skipped: Resend client not initialized or ADMIN_EMAIL not set");
    }

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