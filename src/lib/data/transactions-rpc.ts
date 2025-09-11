// Transaction data functions using Supabase RPC
// These replace the complex client-side filtering with efficient database queries

import { createClient } from '../supabase/client';
import type { Transaction } from '@/types';
import { getCurrentUser } from '../auth';

export interface TransactionFilters {
  category?: string;
  period?: string;
  merchant?: string;
  type?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netTotal: number;
  transactionCount: number;
}

export interface FilterOptions {
  categories: string[];
  merchants: string[];
  types: string[];
  periods: string[];
}

/**
 * Get filtered transactions using Supabase RPC
 */
export async function getFilteredTransactions(
  filters: TransactionFilters = {},
  limit: number = 1000
): Promise<Transaction[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_filtered_transactions', {
    p_user_id: user.id,
    p_category: filters.category || null,
    p_period: filters.period || null,
    p_merchant: filters.merchant || null,
    p_type: filters.type || null,
    p_limit: limit,
  });

  if (error) {
    console.error('Error fetching filtered transactions:', error);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return data || [];
}

/**
 * Get transaction filter options using Supabase RPC
 */
export async function getTransactionFilterOptions(): Promise<FilterOptions> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      categories: ['All Categories'],
      merchants: ['All Merchants'],
      types: ['All Types'],
      periods: ['This Month', 'Last Month', 'Last 3 Months', 'This Year', 'All Time'],
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_transaction_filter_options', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error fetching filter options:', error);
    // Return default options on error
    return {
      categories: ['All Categories'],
      merchants: ['All Merchants'],
      types: ['All Types'],
      periods: ['This Month', 'Last Month', 'Last 3 Months', 'This Year', 'All Time'],
    };
  }

  // The RPC returns a single row with arrays
  const options = data?.[0];
  return {
    categories: options?.categories || ['All Categories'],
    merchants: options?.merchants || ['All Merchants'],
    types: options?.types || ['All Types'],
    periods: options?.periods || ['This Month', 'Last Month', 'Last 3 Months', 'This Year', 'All Time'],
  };
}

/**
 * Get transaction summary using Supabase RPC
 */
export async function getTransactionSummary(
  filters: TransactionFilters = {}
): Promise<TransactionSummary> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netTotal: 0,
      transactionCount: 0,
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_transaction_summary', {
    p_user_id: user.id,
    p_category: filters.category || null,
    p_period: filters.period || null,
    p_merchant: filters.merchant || null,
    p_type: filters.type || null,
  });

  if (error) {
    console.error('Error fetching transaction summary:', error);
    throw new Error(`Failed to fetch transaction summary: ${error.message}`);
  }

  const summary = data?.[0];
  return {
    totalIncome: Number(summary?.total_income || 0),
    totalExpenses: Number(summary?.total_expenses || 0),
    netTotal: Number(summary?.net_total || 0),
    transactionCount: Number(summary?.transaction_count || 0),
  };
}

/**
 * Get recent transactions for dashboard
 */
export async function getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_recent_transactions', {
    p_user_id: user.id,
    p_limit: limit,
  });

  if (error) {
    console.error('Error fetching recent transactions:', error);
    throw new Error(`Failed to fetch recent transactions: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all transactions for a user (fallback function)
 */
export async function getCurrentUserTransactions(): Promise<Transaction[]> {
  // Use the RPC with no filters to get all transactions
  return getFilteredTransactions({}, 10000);
}

/**
 * Create a new transaction
 */
export async function createTransaction(
  transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Transaction> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transactionData,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    throw new Error(`Failed to create transaction: ${error.message}`);
  }

  return data;
}

/**
 * Update a transaction
 */
export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
): Promise<Transaction> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    throw new Error(`Failed to update transaction: ${error.message}`);
  }

  return data;
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const supabase = createClient();
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }
}
