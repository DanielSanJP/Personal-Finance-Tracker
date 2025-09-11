import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUserTransactions, getTransactionsByUserId } from '@/lib/data/transactions';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from './useAuth';
import type { Transaction } from '@/types';

export interface TransactionFilters extends Record<string, unknown> {
  category?: string;
  period?: string;
  merchant?: string;
  type?: string;
  accountId?: string;
}

/**
 * Hook to fetch current user's transactions with optional filtering
 */
export function useTransactions(filters: TransactionFilters = {}) {
  const { user, isGuest } = useAuth();

  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) return [];
      return getCurrentUserTransactions();
    },
    enabled: !!user,
    staleTime: isGuest ? 10 * 60 * 1000 : 2 * 60 * 1000, // Guest data can be stale longer
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: !isGuest, // Don't refetch for guests on focus
  });
}

/**
 * Hook to fetch transactions by user ID (useful for admin views)
 */
export function useTransactionsByUserId(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.transactions.list({ userId }),
    queryFn: (): Promise<Transaction[]> => {
      if (!userId) throw new Error('User ID is required');
      return getTransactionsByUserId(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single transaction by ID
 */
export function useTransaction(transactionId: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.transactions.detail(transactionId || ''),
    queryFn: async (): Promise<Transaction | null> => {
      if (!transactionId) return null;

      // First try to get from the transactions list cache
      const transactionsList = queryClient.getQueryData<Transaction[]>(
        queryKeys.transactions.lists()
      );
      
      if (transactionsList) {
        const transaction = transactionsList.find(t => t.id === transactionId);
        if (transaction) return transaction;
      }

      // If not found in cache, fetch all transactions (which will cache them)
      const allTransactions = await getCurrentUserTransactions();
      return allTransactions.find(t => t.id === transactionId) || null;
    },
    enabled: !!transactionId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get filtered transactions from cache (optimized for client-side filtering)
 */
export function useFilteredTransactions(filters: TransactionFilters) {
  const { data: transactions = [], isLoading, error, ...queryResult } = useTransactions();

  const filteredTransactions = transactions.filter((transaction) => {
    // Category filter
    if (filters.category && filters.category !== 'All Categories' && 
        transaction.category !== filters.category) {
      return false;
    }

    // Merchant filter
    if (filters.merchant && filters.merchant !== 'All Merchants' && 
        transaction.merchant !== filters.merchant) {
      return false;
    }

    // Type filter
    if (filters.type && filters.type !== 'All Types' && 
        transaction.type !== filters.type) {
      return false;
    }

    // Account filter
    if (filters.accountId && transaction.accountId !== filters.accountId) {
      return false;
    }

    // Period filter
    if (filters.period && filters.period !== 'All Time') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      switch (filters.period) {
        case 'This Month':
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        case 'Last Month':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return transactionDate.getMonth() === lastMonth && 
                 transactionDate.getFullYear() === lastMonthYear;
        case 'Last 3 Months':
          const threeMonthsAgo = new Date(currentYear, currentMonth - 3, 1);
          return transactionDate >= threeMonthsAgo;
        case 'This Year':
          return transactionDate.getFullYear() === currentYear;
        default:
          return true;
      }
    }

    return true;
  });

  return {
    ...queryResult,
    data: filteredTransactions,
    isLoading, // Explicitly pass through the loading state from base query
    error, // Explicitly pass through the error state from base query
  };
}

/**
 * Utility hook to get unique filter options from transactions
 */
export function useTransactionFilterOptions() {
  const { data: transactions = [] } = useTransactions();

  const categories = [
    'All Categories',
    ...Array.from(new Set(transactions.map(t => t.category))).filter(Boolean),
  ];

  const merchants = [
    'All Merchants',
    ...Array.from(new Set(transactions.map(t => t.merchant))).filter(Boolean),
  ];

  const types = [
    'All Types',
    ...Array.from(new Set(transactions.map(t => t.type))).filter(Boolean),
  ];

  const periods = [
    'This Month',
    'Last Month',
    'Last 3 Months',
    'This Year',
    'All Time',
  ];

  return {
    categories,
    merchants,
    types,
    periods,
  };
}
