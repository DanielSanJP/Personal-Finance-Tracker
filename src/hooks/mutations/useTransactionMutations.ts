import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  createExpenseTransaction, 
  createIncomeTransaction
} from '@/hooks/queries/useTransactions';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from '../queries/useAuth';
import { checkGuestAndWarn } from '@/lib/guest-protection';
import type { Transaction } from '@/types';

interface CreateTransactionData {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category?: string;
  merchant?: string;
  accountId: string;
  status?: 'pending' | 'completed' | 'cancelled' | 'failed';
  date: Date;
}

interface CreateExpenseData {
  amount: number;
  description: string;
  category?: string;
  merchant?: string;
  accountId: string;
  status?: string;
  date: Date;
}

interface CreateIncomeData {
  amount: number;
  description: string;
  source: string;
  accountId: string;
  date: Date;
}

interface CreateTransferData {
  amount: number;
  description: string;
  category?: string;
  merchant?: string;
  accountId: string;
  status?: string;
  date: Date;
}

/**
 * Generic transaction creation mutation
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { isGuest } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTransactionData) => {
      // Check for guest user restrictions
      const isGuestUser = await checkGuestAndWarn('create transactions');
      if (isGuestUser) {
        throw new Error('Guest users cannot create transactions');
      }

      // Determine which function to call based on transaction type
      if (data.type === 'income') {
        return createIncomeTransaction({
          amount: data.amount,
          description: data.description,
          source: data.category || '',
          accountId: data.accountId,
          date: data.date,
        });
      } else {
        return createExpenseTransaction({
          amount: data.amount,
          description: data.description,
          category: data.category,
          merchant: data.merchant,
          accountId: data.accountId,
          status: data.status,
          date: data.date,
        });
      }
    },
    onMutate: async (newTransaction) => {
      if (isGuest) return; // Don't do optimistic updates for guests

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions.all });

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData<Transaction[]>(
        queryKeys.transactions.lists()
      );

      // Optimistically update to the new value
      if (previousTransactions) {
        const optimisticTransaction: Transaction = {
          id: `temp-${Date.now()}`, // Temporary ID
          user_id: 'current-user', // Will be updated with real data
          account_id: newTransaction.accountId,
          date: newTransaction.date.toISOString(),
          description: newTransaction.description,
          amount: newTransaction.amount,
          category: newTransaction.category || null,
          type: newTransaction.type,
          merchant: newTransaction.merchant || null,
          status: newTransaction.status || 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        queryClient.setQueryData<Transaction[]>(
          queryKeys.transactions.lists(),
          [...previousTransactions, optimisticTransaction]
        );
      }

      return { previousTransactions };
    },
    onError: (err, newTransaction, context) => {
      // Rollback on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          queryKeys.transactions.lists(),
          context.previousTransactions
        );
      }
      
      toast.error('Failed to create transaction', {
        description: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    },
    onSuccess: () => {
      // Invalidate ALL related queries for comprehensive data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      
      toast.success('Transaction created successfully!');
    },
  });
}

/**
 * Expense transaction creation mutation
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseData) => {
      const isGuestUser = await checkGuestAndWarn('create expenses');
      if (isGuestUser) {
        throw new Error('Guest users cannot create expenses');
      }

      return createExpenseTransaction(data);
    },
    onSuccess: () => {
      // Invalidate ALL related queries for comprehensive data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      
      toast.success('Expense created successfully!');
    },
    onError: (err) => {
      toast.error('Failed to create expense', {
        description: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    },
  });
}

/**
 * Income transaction creation mutation
 */
export function useCreateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIncomeData) => {
      const isGuestUser = await checkGuestAndWarn('create income');
      if (isGuestUser) {
        throw new Error('Guest users cannot create income');
      }

      return createIncomeTransaction(data);
    },
    onSuccess: () => {
      // Invalidate ALL related queries for comprehensive data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      
      toast.success('Income added successfully!');
    },
    onError: (err) => {
      toast.error('Failed to add income', {
        description: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    },
  });
}

/**
 * Transfer transaction creation mutation
 */
export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransferData) => {
      const isGuestUser = await checkGuestAndWarn('create transfers');
      if (isGuestUser) {
        throw new Error('Guest users cannot create transfers');
      }

      // Create transfer as an expense transaction with 'transfer' type
      return createExpenseTransaction({
        amount: data.amount,
        description: data.description,
        category: data.category || 'Transfer',
        merchant: data.merchant,
        accountId: data.accountId,
        status: data.status,
        date: data.date,
      });
    },
    onSuccess: () => {
      // Invalidate ALL related queries for comprehensive data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      
      toast.success('Transfer completed successfully!');
    },
    onError: (err) => {
      toast.error('Failed to complete transfer', {
        description: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    },
  });
}
