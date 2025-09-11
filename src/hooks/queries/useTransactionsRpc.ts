import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getFilteredTransactions, 
  getTransactionFilterOptions, 
  getTransactionSummary,
  getRecentTransactions,
  getCurrentUserTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  TransactionFilters
} from '@/lib/data/transactions-rpc';
import { Transaction } from '@/types';

// Query keys for RPC-based queries
export const TRANSACTION_RPC_QUERY_KEYS = {
  transactions: (filters: TransactionFilters) => ['transactions-rpc', filters],
  filterOptions: ['transaction-filter-options-rpc'],
  summary: (filters: TransactionFilters) => ['transaction-summary-rpc', filters],
  recent: (limit: number) => ['recent-transactions-rpc', limit],
  all: ['all-transactions-rpc'],
} as const;

/**
 * Hook to get filtered transactions using RPC
 */
export function useFilteredTransactionsRpc(filters: TransactionFilters = {}, pageSize?: number) {
  return useQuery({
    queryKey: TRANSACTION_RPC_QUERY_KEYS.transactions(filters),
    queryFn: () => getFilteredTransactions(filters, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to get transaction filter options using RPC
 */
export function useTransactionFilterOptionsRpc() {
  return useQuery({
    queryKey: TRANSACTION_RPC_QUERY_KEYS.filterOptions,
    queryFn: getTransactionFilterOptions,
    staleTime: 1000 * 60 * 15, // 15 minutes (filter options don't change often)
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to get transaction summary using RPC
 */
export function useTransactionSummaryRpc(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: TRANSACTION_RPC_QUERY_KEYS.summary(filters),
    queryFn: () => getTransactionSummary(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to get recent transactions for dashboard
 */
export function useRecentTransactionsRpc(limit: number = 10) {
  return useQuery({
    queryKey: TRANSACTION_RPC_QUERY_KEYS.recent(limit),
    queryFn: () => getRecentTransactions(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes (dashboard data should be fresh)
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get all transactions (fallback)
 */
export function useAllTransactionsRpc() {
  return useQuery({
    queryKey: TRANSACTION_RPC_QUERY_KEYS.all,
    queryFn: getCurrentUserTransactions,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Mutation hook to create a new transaction
 */
export function useCreateTransactionRpc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidate all transaction-related queries
      queryClient.invalidateQueries({ queryKey: ['transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['recent-transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['all-transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-filter-options-rpc'] });
    },
  });
}

/**
 * Mutation hook to update a transaction
 */
export function useUpdateTransactionRpc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>> }) =>
      updateTransaction(id, updates),
    onSuccess: () => {
      // Invalidate all transaction-related queries
      queryClient.invalidateQueries({ queryKey: ['transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['recent-transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['all-transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-filter-options-rpc'] });
    },
  });
}

/**
 * Mutation hook to delete a transaction
 */
export function useDeleteTransactionRpc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      // Invalidate all transaction-related queries
      queryClient.invalidateQueries({ queryKey: ['transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['recent-transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['all-transactions-rpc'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-filter-options-rpc'] });
    },
  });
}
