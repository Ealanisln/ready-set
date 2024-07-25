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

  // Retrieve Mailchimp credentials from environment variables
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const API_SERVER = process.env.MAILCHIMP_API_SERVER;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

  // Construct Mailchimp API request URL
  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  // Prepare request data
  const data = {
    email_address: emailValidation.data,
    status: "subscribed",
  };

  // Set request headers
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `api_key ${API_KEY}`,
    },
  };

  // Send POST request to Mailchimp API
  try {
    const response = await axios.post(url, data, options);
    if (response.status == 200) {
      return NextResponse.json({ message: "Awesome! You have successfully subscribed!" }, { status: 201 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `${error.response?.status}`,
        `${error.response?.data.title}`,
        `${error.response?.data.detail}`,
      );

      if (error.response?.data.title == "Member Exists") {
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