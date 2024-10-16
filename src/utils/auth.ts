import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prismaDB";
import type { Adapter } from "next-auth/adapters";
import { user } from "@prisma/client";

type UsersType =
  | "vendor"
  | "client"
  | "driver"
  | "admin"
  | "helpdesk"
  | "super_admin";

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

        const user = await prisma.user.findUnique({
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
        token.type = (user as user).type;
        token.isTemporaryPassword = (user as user).isTemporaryPassword;
      }
      if (account && account.type === "oauth") {
        await prisma.user.update({
          where: { id: token.id },
          data: { isTemporaryPassword: false },
        });
        token.isTemporaryPassword = false;
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
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (dbUser?.isTemporaryPassword) {
          return true; // Allow sign in, we'll handle redirection on the client side
        }
      }
      return true;
    },
  },

  events: {
    async signIn({ user, account }) {
      if (account?.type === "oauth") {
        await prisma.user.update({
          where: { id: user.id },
          data: { isTemporaryPassword: false },
        });
      }
    },
  },
};