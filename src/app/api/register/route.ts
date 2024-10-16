// src/app/api/register/route.ts

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { PrismaClient, Prisma, users_status, users_type } from "@prisma/client";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();

interface BaseFormData {
  email: string;
  phoneNumber: string;
  userType: users_type;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

interface VendorFormData extends BaseFormData {
  company: string;
  contact_name: string;
  timeNeeded: string[];
  frequency: string;
  parking?: string;
  countiesServed?: string[];
  website?: string;
  cateringBrokerage?: string[];
  provisions?: string[];
}

interface ClientFormData extends BaseFormData {
  company: string;
  contact_name: string;
  timeNeeded: string[];
  frequency: string;
  countiesServed: string[];
  head_count: string;
  parking?: string;
  website?: string;
}

interface DriverFormData extends BaseFormData {
  name: string;
}

interface HelpDeskFormData extends BaseFormData {
  name: string;
}

type RequestBody =
  | VendorFormData
  | ClientFormData
  | DriverFormData
  | HelpDeskFormData;

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
    from: process.env.FROM_EMAIL || "emmanuel@alanis.dev", // Update this with your verified sender email
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
    const body: RequestBody = await request.json();

    const { email, phoneNumber, userType } = body;

    if (!email || !phoneNumber || !userType) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: ["email", "phoneNumber", "userType"].filter(
            (field) => !body[field as keyof RequestBody],
          ),
        },
        { status: 400 },
      );
    }

    const commonFields = ["street1", "city", "state", "zip"];
    let requiredFields: string[] = [...commonFields];

    if (userType === "vendor" || userType === "client") {
      requiredFields = [
        ...requiredFields,
        "company",
        "contact_name",
        "timeNeeded",
        "frequency",
      ];
      if (userType === "client") {
        requiredFields.push("countiesServed", "head_count");
      }
    } else if (userType === "driver" || userType === "helpdesk") {
      requiredFields.push("name");
    }

    const missingFields = requiredFields.filter(
      (field) => !(body as any)[field],
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields for ${userType}`,
          missingFields,
        },
        { status: 400 },
      );
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (exist) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 400 },
      );
    }

    // Generate a temporary password
    const temporaryPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Generate a password reset token
    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const userData: Prisma.userCreateInput = {
      email: email.toLowerCase(),
      contact_number: phoneNumber,
      password: hashedPassword,
      type: userType as users_type,
      name:
        userType === "driver" || userType === "helpdesk"
          ? (body as DriverFormData | HelpDeskFormData).name
          : (body as VendorFormData | ClientFormData).contact_name,
      company_name:
        userType !== "driver" && userType !== "helpdesk"
          ? (body as VendorFormData | ClientFormData).company
          : undefined,
      status: users_status.pending,
      street1: body.street1,
      street2: body.street2,
      city: body.city,
      state: body.state,
      zip: body.zip,
      created_at: new Date(),
      updated_at: new Date(),
      isTemporaryPassword: true,
      passwordResetToken,
      passwordResetTokenExp,

      // Conditional fields
      ...(userType !== "driver" &&
        userType !== "helpdesk" && {
          parking_loading: "parking" in body ? body.parking : undefined,
          counties:
            "countiesServed" in body
              ? ((
                  body as VendorFormData | ClientFormData
                )?.countiesServed?.join(", ") ?? "")
              : undefined,
          time_needed:
            "timeNeeded" in body
              ? (body as VendorFormData | ClientFormData).timeNeeded.join(", ")
              : undefined,
          frequency:
            "frequency" in body
              ? (body as VendorFormData | ClientFormData).frequency
              : undefined,
          head_count:
            "head_count" in body
              ? (body as ClientFormData).head_count
              : undefined,
          website:
            "website" in body
              ? (body as VendorFormData | ClientFormData).website
              : undefined,
        }),

      // Vendor-specific fields
      ...(userType === "vendor" && {
        catering_brokerage:
          "cateringBrokerage" in body
            ? (body as VendorFormData).cateringBrokerage?.join(", ")
            : undefined,
        provide:
          "provisions" in body
            ? (body as VendorFormData).provisions?.join(", ")
            : undefined,
      }),
    };

    const newUser = await prisma.user.create({
      data: userData,
    });

    // Creating a default address for the user
    await prisma.address.create({
      data: {
        name: "Main Address",
        street1: body.street1,
        street2: body.street2,
        city: body.city,
        state: body.state,
        zip: body.zip,
        county:
          userType === "vendor" || userType === "client"
            ? (body as VendorFormData | ClientFormData).countiesServed?.[0]
            : undefined,
        locationNumber:
          "location_number" in body ? (body as any).location_number : undefined,
        parkingLoading:
          "parking" in body
            ? (body as VendorFormData | ClientFormData).parking
            : undefined,
        isRestaurant: userType === "vendor",
        isShared: false,
        createdBy: newUser.id,
      },
    });

    // Creating a userAddress relation
    await prisma.userAddress.create({
      data: {
        userId: newUser.id,
        addressId: (await prisma.address.findFirst({
          where: { createdBy: newUser.id },
          select: { id: true },
        }))!.id,
        alias: "Main Address",
        isDefault: true,
      },
    });

    // TODO: Send email with temporary password and reset token to user
    // You should implement an email sending function here
    // Example: await sendRegistrationEmail(newUser.email, temporaryPassword, passwordResetToken);

    await sendRegistrationEmail(
      newUser.email!,
      temporaryPassword,
      passwordResetToken,
    );

    return NextResponse.json(
      {
        message:
          "User created successfully! Please check your email for login instructions.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error:
              "A unique constraint would be violated on the User model. (Duplicate email)",
          },
          { status: 400 },
        );
      }
      console.error("Prisma Client Known Request Error:", error.message);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Prisma Client Initialization Error:", error.message);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 },
      );
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Prisma Client Validation Error:", error.message);
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 },
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
