import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prismaDB";
import type { Adapter } from "next-auth/adapters";

// Define the structure of your User type based on your Prisma schema
interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  type: string;
  isTemporaryPassword: boolean;
  // Add other fields from your Prisma User model as needed
}

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }

  interface User extends CustomUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUser {}
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
    error: '/auth/error',
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "johndoe@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
      
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
      
        if (!user || !user?.password) {
          return null;
        }
      
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
      
        if (!passwordMatch) {
          return null;
        }
      
        return user as CustomUser;
      }
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
        token.type = user.type;
        token.isTemporaryPassword = user.isTemporaryPassword;
      }
      if (account && account.type === "oauth") {
        await prisma.user.update({
          where: { id: token.id },
          data: { isTemporaryPassword: false }
        });
        token.isTemporaryPassword = false;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        type: token.type,
        isTemporaryPassword: token.isTemporaryPassword,
      };
      return session;
    },

    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (dbUser?.isTemporaryPassword) {
          // Instead of setting a new property, we'll use the existing one
          return true; // Allow sign in, we'll handle redirection on the client side
        }
      }
      return true;
    }
  },

  events: {
    async signIn({ user, account }) {
      if (account?.type === "oauth") {
        await prisma.user.update({
          where: { id: user.id },
          data: { isTemporaryPassword: false }
        });
      }
    },
  },

  // debug: process.env.NODE_ENV === "development",
};