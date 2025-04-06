// src/utils/currency.ts

import { PrismaDecimal } from "@/types/order";

/**
 * Format a value (Decimal, number, or string) as a currency string with 2 decimal places
 * 
 * @param value The value to format (Prisma Decimal, number, string, null, or undefined)
 * @param defaultValue The default value to return if the input is null/undefined (default: "0.00")
 * @returns Formatted string with 2 decimal places
 */
export const formatCurrency = (
  value: PrismaDecimal | number | string | null | undefined, 
  defaultValue: string = "0.00"
): string => {
  if (value === null || value === undefined) return defaultValue;
  
  // Handle Decimal-like objects with a toFixed method
  if (value && typeof value === 'object' && 'toFixed' in value) {
    return (value as { toFixed: (digits: number) => string }).toFixed(2);
  }
  
  // Handle strings and numbers
  const numValue = typeof value === "string" ? parseFloat(value) : Number(value);
  return isNaN(numValue) ? defaultValue : numValue.toFixed(2);
};

/**
 * Convert a value (Decimal, number, or string) to a number
 * Useful for calculations involving Prisma Decimal values
 * 
 * @param value The value to convert (Prisma Decimal, number, string, null, or undefined)
 * @param defaultValue The default value to return if the input is null/undefined/NaN (default: 0)
 * @returns Number value
 */
export const toNumber = (
  value: PrismaDecimal | number | string | null | undefined,
  defaultValue: number = 0
): number => {
  if (value === null || value === undefined) return defaultValue;
  
  // Handle Decimal-like objects
  if (value && typeof value === 'object' && 'toFixed' in value) {
    return parseFloat((value as { toFixed: (digits: number) => string }).toFixed(10));
  }
  
  // Handle strings and numbers
  const numValue = typeof value === "string" ? parseFloat(value) : Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

/**
 * Add a currency symbol to a formatted value
 * 
 * @param value The formatted value
 * @param symbol The currency symbol (default: "$")
 * @returns String with currency symbol
 */
export const withCurrencySymbol = (value: string, symbol: string = "$"): string => {
  return `${symbol}${value}`;
};