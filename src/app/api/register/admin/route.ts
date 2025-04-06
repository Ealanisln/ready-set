import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { validateAdminRole } from "@/middleware/authMiddleware";
import sgMail from "@sendgrid/mail";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";
import { Prisma, UserType, UserStatus } from "@prisma/client";

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
) => {
  sgMail.setApiKey(process.env.SEND_API_KEY || "");

  const body = `
      <h1>Welcome to Ready Set Platform</h1>
      <p>Your account has been successfully created. Here are your login details:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
      <p>For security reasons, you will be required to change your password upon your first login.</p>
      <p>Please click on the following link to log in:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Login</a>
      <p>If you did not request this account, please ignore this email.</p>
    `;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || "solutions@updates.readysetllc.com",
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
    const validationError = await validateAdminRole(request);
    if (validationError) return validationError;

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
    const existingUser = await prisma.profile.findUnique({
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

    // Create user in Supabase first
    const supabase = await createClient();
    const { data: authData, error: supabaseError } = await supabase.auth.admin.createUser({
      email: body.email.toLowerCase(),
      password: temporaryPassword,
      email_confirm: true
    });

    if (supabaseError) {
      console.error("Error creating user in Supabase:", supabaseError);
      return NextResponse.json(
        { error: "Failed to create user account", details: supabaseError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Create user in your database with the Supabase UUID as the ID
    const userData: Prisma.ProfileCreateInput = {
      id: authData.user.id,
      email: body.email.toLowerCase(),
      name: body.name,
      contactNumber: body.phoneNumber,
      type: body.userType.toUpperCase() as UserType,
      status: UserStatus.PENDING,
      street1: body.street1,
      street2: body.street2,
      city: body.city,
      state: body.state,
      zip: body.zip,
      isTemporaryPassword: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newUser = await prisma.profile.create({
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
    if (newUser.email) {
      // Send registration email
      await sendRegistrationEmail(
        newUser.email,
        temporaryPassword,
      );
    }

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
  } finally {
    await prisma.$disconnect();
  }
}