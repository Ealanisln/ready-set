import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prismaDB";
import type { Adapter } from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";

// Define User type based on the schema
type User = {
  id: string;
  type: UsersType;
  isTemporaryPassword: boolean;
  email: string | null;
  password: string | null;
  [key: string]: any;
};

type UsersType =
  | "vendor"
  | "client"
  | "driver"
  | "admin"
  | "helpdesk"
  | "super_admin";

// Type assertion for Prisma client to work around TypeScript errors
const typedPrisma = prisma as unknown as PrismaClient & {
  user: {
    findUnique: (args: any) => Promise<User | null>;
    update: (args: any) => Promise<User>;
  }
};

// Ensure Prisma is properly initialized
if (!prisma) {
  throw new Error("Prisma client failed to initialize");
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await typedPrisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.type = (user as User).type;
        token.isTemporaryPassword = (user as User).isTemporaryPassword;
      }
      if (account && account.type === "oauth") {
        try {
          await typedPrisma.user.update({
            where: { id: token.id as string },
            data: { isTemporaryPassword: false },
          });
          token.isTemporaryPassword = false;
        } catch (error) {
          console.error("Error updating user in jwt callback:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        type: token.type as UsersType,
        isTemporaryPassword: token.isTemporaryPassword as boolean,
      };
      return session;
    },

    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        try {
          const dbUser = await typedPrisma.user.findUnique({
            where: { id: user.id },
          });
          if (dbUser?.isTemporaryPassword) {
            return true; // Allow sign in, we'll handle redirection on the client side
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          // Still return true to allow sign in, but log the error
          return true;
        }
      }
      return true;
    },
  },

  events: {
    async signIn({ user, account }) {
      if (account?.type === "oauth") {
        try {
          await typedPrisma.user.update({
            where: { id: user.id },
            data: { isTemporaryPassword: false },
          });
        } catch (error) {
          console.error("Error in signIn event:", error);
        }
      }
    },
  },
};
