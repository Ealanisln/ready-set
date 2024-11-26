import { prisma } from "@/utils/prismaDB";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const formatedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: formatedEmail,
      },
    });

    if (!user) {
      return new NextResponse("User doesn't exist", { status: 400 });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetTokenExp = new Date();
    passwordResetTokenExp.setMinutes(passwordResetTokenExp.getMinutes() + 10);

    await prisma.user.update({
      where: {
        email: formatedEmail,
      },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExp,
      },
    });

    // Use NEXT_PUBLIC_SITE_URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetURL = `${baseUrl}/reset-password/${resetToken}`;

    // For debugging
    console.log({
      baseUrl,
      resetURL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });

    const emailTemplate = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You requested to reset your password for your ReadySet LLC account.</p>
        <p>Please click the button below to reset your password. This link will expire in 10 minutes.</p>
        <div style="margin: 20px 0;">
          <a href="${resetURL}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
             target="_blank">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">
          If you didn't request this password reset, please ignore this email.
          If you're having trouble clicking the button, copy and paste this URL into your browser:
          <br>
          ${resetURL}
        </p>
      </div>
    `;

    await sendEmail({
      to: formatedEmail,
      subject: "ReadySet LLC - Reset Your Password",
      html: emailTemplate,
    });

    return NextResponse.json("An email has been sent to your email", {
      status: 200,
    });
  } catch (error: any) {
    console.error('Error in password reset:', error);
    if (error.response) {
      console.error('SendGrid API response:', error.response.body);
    }
    return NextResponse.json("An error occurred while processing your request. Please try again later.", {
      status: 500,
    });
  }
}