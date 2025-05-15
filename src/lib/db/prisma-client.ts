import { PrismaClient } from '@prisma/client';

// This approach is recommended by Vercel for Next.js applications
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

// Add prisma to the global type
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development mode
declare const global: CustomNodeJsGlobal;

// Initialize Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error'] 
      : ['error'],
  });
};

// Use the global object for caching in development
const prisma = global.prisma ?? prismaClientSingleton();

// Assign the instance to the global object in development
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };
export default prisma; 