// src/app/api/create-payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(req: Request) {
  try {
    const { planTitle, hours, totalPrice, pricePerHour } = await req.json();
    
    // Get the host from headers
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create Checkout Sessions for one-time purchase
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planTitle,
              description: `${hours} hours of virtual assistance at $${pricePerHour}/hour`,
            },
            unit_amount: totalPrice * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Changed from 'subscription' to 'payment'
      success_url: `${baseUrl}/payment?status=success&plan=${encodeURIComponent(planTitle)}`,
      cancel_url: `${baseUrl}/payment?status=canceled`,
      metadata: {
        plan: planTitle,
        hours: hours.toString(),
        pricePerHour: pricePerHour.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { 
        error: err instanceof Error ? err.message : 'Error creating checkout session',
        details: err
      },
      { status: 500 }
    );
  }
}