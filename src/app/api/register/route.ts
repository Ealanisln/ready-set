import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { FormData } from "@/components/Auth/SignUp/ui/FormData"; // Import your schema

export async function POST(request: any) {
  const body: FormData = await request.json();
  const { 
    name, 
    email, 
    phoneNumber, 
    password, 
    userType, 
    company, 
    parking,
    countiesServed,
    countyLocation,
    timeNeeded,
    cateringBrokerage,
    frequency,
    provisions,
    headcount
  } = body;

  if (!name || !email || !phoneNumber || !password || !userType || !company) {
    return NextResponse.json("Missing required fields", { status: 400 });
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (exist) {
    return NextResponse.json("User already exists!", { status: 500 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData: any = {
    name,
    email: email.toLowerCase(),
    contact_number: phoneNumber,
    password: hashedPassword,
    userType,
    company,
    parking,
    timeNeeded,
    frequency,
  };

  if (userType === 'vendor') {
    userData.countiesServed = countiesServed;
    userData.cateringBrokerage = cateringBrokerage;
    userData.provisions = provisions;
  } else if (userType === 'client' || userType === 'driver') {
    userData.countyLocation = countyLocation;
    userData.headcount = headcount;
  }

  await prisma.user.create({
    data: userData,
  });

  return NextResponse.json("User created successfully!", { status: 200 });
}