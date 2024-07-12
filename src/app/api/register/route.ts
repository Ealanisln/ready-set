import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { PrismaClient, Prisma, users_status, users_type } from "@prisma/client";
import { FormData } from "@/components/Auth/SignUp/ui/FormData";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body: FormData = await request.json();
    console.log("Request body:", body);

    const {
      name,
      email,
      website,
      phoneNumber,
      password,
      userType,
      company,
      parking,
      countiesServed,
      timeNeeded,
      cateringBrokerage,
      frequency,
      provisions,
      headcount,
      contact_name,
      street1,
      street2,
      city,
      state,
      zip,
      location_number,
    } = body;

    // Validate required fields
    if (!contact_name || !email || !phoneNumber || !password || !userType || !company) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Prisma.userCreateInput = {
      name,
      email: email.toLowerCase(),
      contact_number: phoneNumber,
      password: hashedPassword,
      type: userType as users_type,
      company_name: company,
      parking_loading: parking,
      counties: Array.isArray(countiesServed)
        ? countiesServed.join(", ")
        : countiesServed,
      time_needed: Array.isArray(timeNeeded)
        ? timeNeeded.join(", ")
        : timeNeeded,
      catering_brokerage: Array.isArray(cateringBrokerage)
        ? cateringBrokerage.join(", ")
        : cateringBrokerage,
      frequency:
        typeof frequency === "object" && "value" in frequency
          ? frequency.value
          : frequency,
      provide: Array.isArray(provisions) ? provisions.join(", ") : provisions,
      head_count: headcount?.toString(),
      status: users_status.pending,
      contact_name,
      website,
      street1,
      street2,
      city,
      state,
      zip,
      location_number: location_number?.toString(),
    };

    const newUser = await prisma.user.create({
      data: userData,
    });

    console.log("User creation successful");
    return NextResponse.json(
      { message: "User created successfully!" },
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
