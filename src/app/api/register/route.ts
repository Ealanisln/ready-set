import { NextResponse } from "next/server";
import { PrismaClient, Prisma, users_status, users_type } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

interface BaseFormData {
  email: string;
  password: string;  // Required for registration
  phoneNumber: string;
  userType: users_type;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  location_number?: string;
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

type RequestBody = VendorFormData | ClientFormData | DriverFormData | HelpDeskFormData;

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { email, password, phoneNumber, userType } = body;

    // Basic field validation
    if (!email || !password || !phoneNumber || !userType) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: ["email", "password", "phoneNumber", "userType"].filter(
            (field) => !body[field as keyof RequestBody]
          ),
        },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Additional required fields based on user type
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
      (field) => !(field in body)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields for ${userType}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // We'll check for existing users in Prisma first
    // Then we'll handle potential conflicts with Supabase during user creation

    // Check for existing user in Prisma
    const existInPrisma = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existInPrisma) {
      return NextResponse.json(
        { error: "User already exists in our system!" },
        { status: 400 }
      );
    }

    // Create user in Supabase
    // Note: Supabase will automatically return an error if the email already exists
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: {
        // Set up email confirmation redirect if needed
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        // Include user metadata
        data: {
          userType,
          name: userType === "driver" || userType === "helpdesk"
            ? (body as DriverFormData | HelpDeskFormData).name
            : (body as VendorFormData | ClientFormData).contact_name,
          company: userType !== "driver" && userType !== "helpdesk"
            ? (body as VendorFormData | ClientFormData).company
            : "",
        }
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: "Failed to create user in authentication system", details: authError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account", details: "No user data returned" },
        { status: 500 }
      );
    }

    // Get the Supabase user ID
    const supabaseUserId = authData.user.id;

    // Prepare user data for Prisma
    const userData: Prisma.userCreateInput = {
      id: supabaseUserId, // Use Supabase UUID as the user ID in Prisma
      email: email.toLowerCase(),
      password: "", // No need to store the password in Prisma anymore
      contact_number: phoneNumber,
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
      isTemporaryPassword: false,

      // Conditional fields for vendor and client
      ...(userType !== "driver" && userType !== "helpdesk" && {
        parking_loading: "parking" in body ? body.parking : undefined,
        counties:
          "countiesServed" in body
            ? ((body as VendorFormData | ClientFormData)?.countiesServed?.join(", ") ?? "")
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

    // Create the user in Prisma
    const newUser = await prisma.user.create({
      data: userData,
    });

    // Create default address
    const address = await prisma.address.create({
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
        locationNumber: "location_number" in body ? body.location_number : undefined,
        parkingLoading:
          "parking" in body
            ? (body as VendorFormData | ClientFormData).parking
            : undefined,
        isRestaurant: userType === "vendor",
        isShared: false,
        createdBy: newUser.id,
      },
    });

    // Create user-address relation
    await prisma.userAddress.create({
      data: {
        userId: newUser.id,
        addressId: address.id,
        alias: "Main Address",
        isDefault: true,
      },
    });

    // No need to update user metadata here since we included it in the signUp options

    return NextResponse.json(
      {
        message: "User created successfully!",
        userId: newUser.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "A unique constraint would be violated on the User model. (Duplicate email)",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Database connection error", details: error.message },
        { status: 500 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "Invalid data provided", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}