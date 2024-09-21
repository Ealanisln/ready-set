import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  PrismaClient,
  Prisma,
  users_status,
  users_type,
  addresses_status,
} from "@prisma/client";
import {
  VendorFormData,
  ClientFormData,
  DriverFormData,
  HelpDeskFormData,
} from "@/components/Auth/SignUp/ui/FormData";

const prisma = new PrismaClient();

type RequestBody = VendorFormData | ClientFormData | DriverFormData | HelpDeskFormData;

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    const { email, phoneNumber, password, userType } = body;

    if (!email || !phoneNumber || !password || !userType) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: [
            "email",
            "phoneNumber",
            "password",
            "userType",
          ].filter((field) => !body[field as keyof RequestBody]),
        },
        { status: 400 },
      );
    }

    if (userType === "vendor") {
      const {
        company,
        contact_name,
        street1,
        city,
        state,
        zip,
        timeNeeded,
        frequency,
      } = body as VendorFormData;
      if (
        !company ||
        !contact_name ||
        !street1 ||
        !city ||
        !state ||
        !zip ||
        !timeNeeded ||
        !frequency
      ) {
        return NextResponse.json(
          {
            error: "Missing required fields for vendor",
            missingFields: [
              "company",
              "contact_name",
              "street1",
              "city",
              "state",
              "zip",
              "timeNeeded",
              "frequency",
            ].filter(
              (field) =>
                !(body as VendorFormData)[field as keyof VendorFormData],
            ),
          },
          { status: 400 },
        );
      }
    } else if (userType === "client") {
      const {
        company,
        contact_name,
        street1,
        city,
        state,
        zip,
        timeNeeded,
        frequency,
        countiesServed,
        head_count,
      } = body as ClientFormData;
      if (
        !company ||
        !contact_name ||
        !street1 ||
        !city ||
        !state ||
        !zip ||
        !timeNeeded ||
        !frequency ||
        !countiesServed ||
        !head_count
      ) {
        return NextResponse.json(
          {
            error: "Missing required fields for client",
            missingFields: [
              "company",
              "contact_name",
              "street1",
              "city",
              "state",
              "zip",
              "timeNeeded",
              "frequency",
              "countiesServed",
              "head_count",
            ].filter(
              (field) =>
                !(body as ClientFormData)[field as keyof ClientFormData],
            ),
          },
          { status: 400 },
        );
      }
    } else if (userType === "driver") {
      const { name, street1, city, state, zip } = body as DriverFormData;
      if (!name || !street1 || !city || !state || !zip) {
        return NextResponse.json(
          {
            error: "Missing required fields for driver",
            missingFields: [
              "contact_name",
              "street1",
              "city",
              "state",
              "zip",
            ].filter(
              (field) =>
                !(body as DriverFormData)[field as keyof DriverFormData],
            ),
          },
          { status: 400 },
        );
      }
    } else if (userType === "helpdesk") {
      const { name, street1, city, state, zip } = body as HelpDeskFormData;
      if (!name || !street1 || !city || !state || !zip) {
        return NextResponse.json(
          {
            error: "Missing required fields for helpdesk",
            missingFields: [
              "name",
              "street1",
              "city",
              "state",
              "zip",
            ].filter(
              (field) =>
                !(body as HelpDeskFormData)[field as keyof HelpDeskFormData],
            ),
          },
          { status: 400 },
        );
      }
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
      email: email.toLowerCase(),
      contact_number: phoneNumber,
      password: hashedPassword,
      type: userType as users_type,
      name: 
        userType === "driver" || userType === "helpdesk"
          ? (body as DriverFormData | HelpDeskFormData).name
          : (body as VendorFormData | ClientFormData).contact_name,
      company_name:
        userType !== "driver" && "company" in body ? body.company : undefined,
      status: users_status.pending,
      street1: body.street1,
      street2: "street2" in body ? body.street2 : undefined,
      city: body.city,
      state: body.state,
      zip: body.zip,
      created_at: new Date(),
      updated_at: new Date(),

      // Conditional fields
      ...(userType !== "driver" && {
        parking_loading: "parking" in body ? body.parking : undefined,
        counties:
          "countiesServed" in body
            ? (body as VendorFormData | ClientFormData).countiesServed.join(
                ", ",
              )
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
          "head_count" in body ? body.head_count?.toString() : undefined,
        website: "website" in body ? body.website : undefined,
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

    const addressData: Prisma.addressCreateInput = {
      user: {
        connect: { id: newUser.id },
      },
      county: "Main Address",
      vendor: userType === "vendor" ? newUser.company_name : null,
      street1: body.street1,
      street2: "street2" in body ? body.street2 : null,
      city: body.city,
      state: body.state,
      zip: body.zip,
      location_number: "location_number" in body ? body.location_number : null,
      parking_loading: "parking" in body ? body.parking : null,
      status: addresses_status.active,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await prisma.address.create({
      data: addressData,
    });

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
