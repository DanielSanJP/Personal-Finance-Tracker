import { useQuery } from '@tanstack/react-query';
import { getCurrentUserAccounts, getAccountsByUserId, getTotalBalance } from '@/lib/data/accounts';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from './useAuth';
import type { Account } from '@/types';

/**
 * Hook to fetch current user's accounts
 */
export function useAccounts() {
  const { user, isGuest } = useAuth();

  return useQuery({
    queryKey: queryKeys.accounts.lists(),
    queryFn: async (): Promise<Account[]> => {
      if (!user) return [];
      return getCurrentUserAccounts();
    },
    enabled: !!user,
    staleTime: isGuest ? 10 * 60 * 1000 : 3 * 60 * 1000, // Account data can be less fresh
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: !isGuest,
  });
}

/**
 * Hook to fetch accounts by user ID
 */
export function useAccountsByUserId(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.accounts.list({ userId }),
    queryFn: (): Promise<Account[]> => {
      if (!userId) throw new Error('User ID is required');
      return getAccountsByUserId(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single account by ID
 */
export function useAccount(accountId: string | undefined) {
  const { data: accounts = [] } = useAccounts();

  return useQuery({
    queryKey: queryKeys.accounts.detail(accountId || ''),
    queryFn: async (): Promise<Account | null> => {
      if (!accountId) return null;
      
      // Try to find in the accounts list cache first
      const account = accounts.find(acc => acc.id === accountId);
      if (account) return account;

      // If not found and we have accounts, it doesn't exist
      if (accounts.length > 0) return null;

      // Otherwise fetch accounts and try again
      const allAccounts = await getCurrentUserAccounts();
      return allAccounts.find(acc => acc.id === accountId) || null;
    },
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get total balance across all accounts
 */
export function useTotalBalance() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.accounts.balance('total'),
    queryFn: getTotalBalance,
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // Balance should be relatively fresh
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get active accounts only
 */
export function useActiveAccounts() {
  const { data: accounts = [], ...queryResult } = useAccounts();
  
  const activeAccounts = accounts.filter(account => account.isActive);

  return {
    ...queryResult,
    data: activeAccounts,
  };
}

/**
 * Hook to get accounts grouped by type
 */
export function useAccountsByType() {
  const { data: accounts = [], ...queryResult } = useAccounts();

  const accountsByType = accounts.reduce((acc, account) => {
    const type = account.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  return {
    ...queryResult,
    data: accountsByType,
  };
}
