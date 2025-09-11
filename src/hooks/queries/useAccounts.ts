import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from './useAuth';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import type { Account } from '@/types';

// Data functions (moved from data folder)
async function getCurrentUserAccounts(): Promise<Account[]> {
  const user = await getCurrentUser();
  
  if (!user) {
    return [];
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching accounts:', error);
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }

    // Map database fields to our interface
    return (data || []).map(account => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      balance: Number(account.balance),
      type: account.type,
      accountNumber: account.account_number || '',
      isActive: account.is_active
    }));
  } catch (error) {
    console.error('Error in getCurrentUserAccounts:', error);
    return [];
  }
}

async function getAccountsByUserId(userId: string): Promise<Account[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching accounts by user ID:', error);
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }

    return (data || []).map(account => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      balance: Number(account.balance),
      type: account.type,
      accountNumber: account.account_number || '',
      isActive: account.is_active
    }));
  } catch (error) {
    console.error('Error in getAccountsByUserId:', error);
    return [];
  }
}

async function getTotalBalance(): Promise<number> {
  const accounts = await getCurrentUserAccounts();
  return accounts.reduce((total: number, account: Account) => total + account.balance, 0);
}

export async function createAccount(accountData: {
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
}): Promise<Account> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
    // Generate a unique ID for the account
    const accountId = `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        id: accountId,
        user_id: user.id,
        name: accountData.name,
        balance: accountData.balance,
        type: accountData.type,
        account_number: accountData.accountNumber || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating account:', error);
      throw new Error(`Failed to create account: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      balance: Number(data.balance),
      type: data.type,
      accountNumber: data.account_number || '',
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export async function updateAccount(accountId: string, accountData: {
  name?: string;
  balance?: number;
  type?: string;
  accountNumber?: string;
  isActive?: boolean;
}): Promise<Account> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('accounts')
      .update({
        name: accountData.name,
        balance: accountData.balance,
        type: accountData.type,
        account_number: accountData.accountNumber,
        is_active: accountData.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', accountId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating account:', error);
      throw new Error(`Failed to update account: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      balance: Number(data.balance),
      type: data.type,
      accountNumber: data.account_number || '',
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
}

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
