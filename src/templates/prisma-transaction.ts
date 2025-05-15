/**
 * This file serves as a template for correctly typing Prisma transactions.
 * Use this pattern in your code to avoid TypeScript errors with transaction parameters.
 */

import { PrismaTransaction } from '@/types/prisma-types';
import { prisma } from '@/lib/prisma';

/**
 * Example function demonstrating properly typed Prisma transaction
 */
export async function exampleTransaction<T>(id: string): Promise<T> {
  return prisma.$transaction(async (tx: PrismaTransaction) => {
    // Example operations within the transaction
    const user = await tx.profile.findUnique({
      where: { id }
    });
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Additional operations as needed
    const orders = await tx.cateringRequest.findMany({
      where: { userId: id },
      take: 5
    });
    
    // Return any result you need
    return {
      user,
      recentOrders: orders
    } as unknown as T;
  });
}

/**
 * Alternative approach using Prisma's own TransactionClient type
 */
export async function alternativeTransaction<T>(id: string): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // The transaction context is properly typed here
    const user = await tx.profile.findUnique({
      where: { id }
    });
    
    // Rest of the function
    return { user } as unknown as T;
  });
} 