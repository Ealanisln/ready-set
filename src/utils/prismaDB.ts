import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const prismaClientSingleton = () => {
  try {
    // Check if DATABASE_URL environment variable is set
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    return new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  } catch (error) {
    console.error("Error initializing Prisma Client:", error);
    throw error;
  }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// If Prisma Client is already defined in the global object, use it
// Otherwise, create a new instance
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// For development, keep the same Prisma Client instance across hot reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Graceful shutdown to properly close Prisma Client connections
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});