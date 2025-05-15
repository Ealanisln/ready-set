/**
 * This file serves as a template for correctly typing Prisma transactions.
 * Use this pattern in your code to avoid TypeScript errors with transaction parameters.
 */

import { Prisma, PrismaClient } from '@prisma/client';
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

/**
 * Example function that creates a new order with multiple items in a transaction
 * @param orderId The ID of the order
 * @param items The items to add to the order
 * @returns The created order with items
 */
export async function createOrderWithItems(
  orderId: string,
  items: {
    name: string;
    quantity: number;
    price: number;
  }[]
) {
  try {
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          id: orderId,
          // other order fields
        },
      });

      // 2. Create all order items related to this order
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            // other item fields
          },
        });
      }

      // 3. Return the order with its items
      return tx.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });
    });

    return result;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
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