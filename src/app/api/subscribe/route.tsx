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

  // Retrieve SendGrid API key from environment variables
  const API_KEY = process.env.SENDGRID_API_KEY;

  // Construct SendGrid API request URL for adding/updating contacts
  const url = 'https://api.sendgrid.com/v3/marketing/contacts';

  // Prepare request data - SendGrid expects contacts in this format
  const data = {
    contacts: [{
      email: emailValidation.data,
    }]
  };

  // Set request headers for SendGrid
  const options = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
  };

  try {
    // Send PUT request to SendGrid API (PUT is used for upsert operations)
    const response = await axios.put(url, data, options);
    
    // Check if the contact was successfully added/updated
    if (response.status === 202) {
      return NextResponse.json({ 
        message: "Awesome! You have successfully subscribed!" 
      }, { status: 201 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `${error.response?.status}`,
        JSON.stringify(error.response?.data, null, 2)
      );

      // Handle rate limiting
      if (error.response?.status === 429) {
        return NextResponse.json({
          error: "Too many requests. Please try again later."
        }, { status: 429 });
      }
    }

    return NextResponse.json({
      error: "Oops! There was an error subscribing you to the newsletter. Please try again later."
    }, { status: 500 });
  }
}