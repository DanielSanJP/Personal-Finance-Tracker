import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the personal finance tracker

/**
 * Format currency with customizable currency code and decimal places
 * @param amount - The amount to format
 * @param currencyCode - ISO currency code (USD, EUR, GBP, CAD, AUD)
 * @param showCents - Whether to show decimal places
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string = 'USD',
  showCents: boolean = true
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
};

export const getCurrentMonthName = () => {
  return new Date().toLocaleString('default', { month: 'long' });
};

// Format date to YYYY-MM-DD in local timezone (avoids UTC conversion issues)
export const formatDateForDatabase = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
