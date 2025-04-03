import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    secret: process.env.BETTER_AUTH_SECRET as string,
    baseUrl: process.env.BETTER_AUTH_URL as string,
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url }, request) => {
                // TODO: Implement your email sending logic here
                console.log(`Magic link for ${email}: ${url}`);
            },
            expiresIn: 300,
            disableSignUp: false
        })
    ]
});

// Use the auth handler directly for magic link operations
export const magicLinkHandler = auth.handler;