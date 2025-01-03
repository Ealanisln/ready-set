// src/app/api/register/admin/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma, users_status, users_type } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { validateAdminRole } from "@/middleware/authMiddleware";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();

interface AdminRegistrationRequest {
  name: string;
  email: string;
  phoneNumber: string;
  userType: 'driver' | 'helpdesk';
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

const sendRegistrationEmail = async (
  email: string,
  temporaryPassword: string,
  passwordResetToken: string,
) => {
  sgMail.setApiKey(process.env.SEND_API_KEY || "");

  const body = `
      <h1>Welcome to Ready Set Platform</h1>
      <p>Your account has been successfully created. Here are your login details:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
      <p>For security reasons, you will be required to change your password upon your first login.</p>
      <p>Please click on the following link to log in and change your password:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/change-password?token=${passwordResetToken}">Change Password</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not request this account, please ignore this email.</p>
    `;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || "emmanuel@alanis.dev",
    subject: "Welcome to Our Platform - Account Created",
    html: body,
  };

  try {
    await sgMail.send(msg);
    console.log("Registration email sent successfully");
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw new Error("Failed to send registration email");
  }
};

export async function POST(request: Request) {
  try {
    // Validate admin role
    const authError = await validateAdminRole(request);
    if (authError) return authError;

    const body: AdminRegistrationRequest = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phoneNumber', 'userType', 'street1', 'city', 'state', 'zip'];
    const missingFields = requiredFields.filter(field => !body[field as keyof AdminRegistrationRequest]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", missingFields },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 400 }
      );
    }

    // Generate temporary password and reset token
    const temporaryPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const userData: Prisma.userCreateInput = {
      email: body.email.toLowerCase(),
      name: body.name,
      contact_number: body.phoneNumber,
      password: hashedPassword,
      type: body.userType,
      status: users_status.pending,
      street1: body.street1,
      street2: body.street2,
      city: body.city,
      state: body.state,
      zip: body.zip,
      isTemporaryPassword: true,
      passwordResetToken,
      passwordResetTokenExp,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newUser = await prisma.user.create({
      data: userData,
    });

    // Create default address
    await prisma.address.create({
      data: {
        name: "Main Address",
        street1: body.street1,
        street2: body.street2,
        city: body.city,
        state: body.state,
        zip: body.zip,
        isRestaurant: false,
        isShared: false,
        createdBy: newUser.id,
      },
    });

    // Create userAddress relation
    const address = await prisma.address.findFirst({
      where: { createdBy: newUser.id },
      select: { id: true },
    });

    if (address) {
      await prisma.userAddress.create({
        data: {
          userId: newUser.id,
          addressId: address.id,
          alias: "Main Address",
          isDefault: true,
        },
      });
    }

    // Check if email exists before sending registration email
    if (!newUser.email) {
      throw new Error("User email is required but was not provided");
    }

    // Send registration email
    await sendRegistrationEmail(
      newUser.email,
      temporaryPassword,
      passwordResetToken,
    );

    return NextResponse.json(
      {
        message: "User created successfully! Login instructions sent via email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin registration error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}