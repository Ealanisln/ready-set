import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

export async function getServerAuth(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return { id: session.user.id };
}