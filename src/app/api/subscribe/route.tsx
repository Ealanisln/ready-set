// api/subscribe/route.ts
import { NextResponse } from 'next/server';
import axios from "axios";
import { z } from "zod";

// Email validation schema
const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email address" });

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();

  // Validate email address
  const emailValidation = EmailSchema.safeParse(body.email);
  if (!emailValidation.success) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  // Retrieve Brevo credentials from environment variables
  const API_KEY = process.env.BREVO_API_KEY;

  // Construct Brevo API request URL
  const url = 'https://api.brevo.com/v3/contacts';

  // Prepare request data
  const data = {
    email: emailValidation.data,
    emailBlacklisted: false,
    updateEnabled: true
  };

  // Set request headers
  const options = {
    headers: {
      "Content-Type": "application/json",
      "api-key": API_KEY,
    },
  };

  // Send POST request to Brevo API
  try {
    const response = await axios.post(url, data, options);
    
    // Brevo returns 201 for new contacts and 204 for updated contacts
    if ([201, 204].includes(response.status)) {
      return NextResponse.json({ 
        message: "Awesome! You have successfully subscribed!" 
      }, { status: 201 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `${error.response?.status}`,
        `${error.response?.data.message}`,
      );

      // Handle duplicate contact case
      if (error.response?.data.message?.includes("Contact already exist")) {
        return NextResponse.json({
          error: "Uh oh, it looks like this email's already subscribed 🧐"
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      error: "Oops! There was an error subscribing you to the newsletter. Please email me at ogbonnakell@gmail.com and I'll add you to the list."
    }, { status: 500 });
  }
}