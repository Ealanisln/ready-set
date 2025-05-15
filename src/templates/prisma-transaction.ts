/**
 * This file serves as a template for correctly typing Prisma transactions.
 * Use this pattern in your code to avoid TypeScript errors with transaction parameters.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

/**
 * Example function demonstrating properly typed Prisma transaction
 */
export async function exampleTransaction<T>(id: string): Promise<T> {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
 * Executes a transaction with better error handling
 * @param transactionFunction The function containing transaction operations
 * @returns The result of the transaction
 */
export async function executeTransaction<T>(
  transactionFunction: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(transactionFunction);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        throw new Error('A unique constraint would be violated.');
      }
      if (error.code === 'P2025') {
        throw new Error('Record not found.');
      }
    }
    
    // Rethrow other errors
    console.error('Transaction failed:', error);
    throw error;
  }
} 