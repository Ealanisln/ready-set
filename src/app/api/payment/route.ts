import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.SITE_URL;

    if (!stripeSecretKey || !siteUrl) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const data = await request.json();
    const priceId = data.priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: siteUrl,
      cancel_url: siteUrl,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json(session.url);
  } catch (error) {
    console.error("Payment session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}