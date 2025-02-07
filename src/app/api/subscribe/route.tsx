import { NextResponse } from 'next/server';
import axios from "axios";
import { z } from "zod";

const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email address" });

export async function POST(request: Request) {
  const body = await request.json();

  // Validate email address
  const emailValidation = EmailSchema.safeParse(body.email);
  if (!emailValidation.success) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  // Retrieve SendGrid credentials from environment variables
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const SENDGRID_LIST_ID = process.env.SENDGRID_LIST_ID;

  // Check for required environment variables
  if (!SENDGRID_API_KEY || !SENDGRID_LIST_ID) {
    console.error('SendGrid configuration missing');
    return NextResponse.json({
      error: "Server configuration error. Please try again later."
    }, { status: 500 });
  }

  // Construct SendGrid API request URL
  const url = 'https://api.sendgrid.com/v3/marketing/contacts';

  // Prepare request data for SendGrid
  const data = {
    list_ids: [SENDGRID_LIST_ID],
    contacts: [{ email: emailValidation.data }]
  };

  // Set request headers
  const options = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SENDGRID_API_KEY}`
    },
  };

  try {
    // Use PUT instead of POST for the Marketing Contacts API
    const response = await axios.put(url, data, options);
    
    // SendGrid returns 202 Accepted for successful requests
    if (response.status === 202) {
      return NextResponse.json({ 
        message: "Awesome! You have successfully subscribed!" 
      }, { status: 201 });
    }

    // Handle unexpected success status
    return NextResponse.json({
      error: "Subscription received but unexpected response. Please verify your subscription."
    }, { status: 500 });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `SendGrid API Error: ${error.response?.status}`,
        JSON.stringify(error.response?.data),
      );

      // Handle specific error cases
      const status = error.response?.status;
      let errorMessage = "Oops! There was an error subscribing you.";

      switch (status) {
        case 400:
          errorMessage = "Invalid request format. Please check your email address.";
          break;
        case 401:
          errorMessage = "Server authentication failed. Please try again later.";
          break;
        case 404:
          errorMessage = "Mailing list not found. Please contact support.";
          break;
        case 405:
          errorMessage = "API method not allowed. Please contact support.";
          break;
      }

      return NextResponse.json({ error: errorMessage }, { status: status || 500 });
    }

    // Handle non-Axios errors
    return NextResponse.json({
      error: "Unexpected system error. Please try again or contact support."
    }, { status: 500 });
  }
}