// types/next-auth.d.ts
import "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      type: UsersType;
      isTemporaryPassword: boolean;
    };
  }

  interface User extends PrismaUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: UsersType;
    isTemporaryPassword: boolean;
  }
}

type UsersType = "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";