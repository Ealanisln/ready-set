import "next-auth";
import { User as PrismaUser } from "@prisma/client";

type UsersType = "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";

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

  interface User extends PrismaUser {
    type: UsersType;
    isTemporaryPassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: UsersType;
    isTemporaryPassword: boolean;
  }
}