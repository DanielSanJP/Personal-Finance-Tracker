import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createAccount, updateAccount, deleteAccount } from '@/hooks/queries/useAccounts';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from '../queries/useAuth';
import { checkGuestAndWarn } from '@/lib/guest-protection';
import type { Account } from '@/types';

interface CreateAccountData {
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
}

interface UpdateAccountData {
  accountId: string;
  name?: string;
  balance?: number;
  type?: string;
  accountNumber?: string;
  isActive?: boolean;
}

/**
 * Mutation hook for creating a new account
 */
export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateAccountData) => {
      // Check for guest user restrictions
      const isGuestUser = await checkGuestAndWarn('create accounts');
      if (isGuestUser) {
        throw new Error('Guest users cannot create accounts');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      return createAccount(user.id, data);
    },
    onMutate: async (newAccount) => {
      if (isGuest) return; // Don't do optimistic updates for guests

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.all });

      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData<Account[]>(
        queryKeys.accounts.lists()
      );

      // Optimistically update to the new value
      if (previousAccounts && user) {
        const optimisticAccount: Account = {
          id: `temp_${Date.now()}`,
          userId: user.id,
          name: newAccount.name,
          balance: newAccount.balance,
          type: newAccount.type,
          accountNumber: newAccount.accountNumber || '',
          isActive: true,
        };

        queryClient.setQueryData<Account[]>(
          queryKeys.accounts.lists(),
          [...previousAccounts, optimisticAccount]
        );
      }

      return { previousAccounts };
    },
    onError: (err, newAccount, context) => {
      // Rollback to previous value on error
      if (context?.previousAccounts) {
        queryClient.setQueryData(
          queryKeys.accounts.lists(),
          context.previousAccounts
        );
      }
      
      console.error('Error creating account:', err);
      toast.error('Failed to create account', {
        description: err instanceof Error ? err.message : 'Please try again later.',
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      
      toast.success('Account created successfully!', {
        description: `${data.name} has been added to your accounts.`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

/**
 * Mutation hook for updating an existing account
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateAccountData) => {
      // Check for guest user restrictions
      const isGuestUser = await checkGuestAndWarn('update accounts');
      if (isGuestUser) {
        throw new Error('Guest users cannot update accounts');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { accountId, ...updateData } = data;
      return updateAccount(user.id, accountId, updateData);
    },
    onMutate: async (updatedAccount) => {
      if (isGuest) return; // Don't do optimistic updates for guests

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.all });

      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData<Account[]>(
        queryKeys.accounts.lists()
      );

      // Optimistically update to the new value
      if (previousAccounts) {
        const newAccounts = previousAccounts.map((account) =>
          account.id === updatedAccount.accountId
            ? { ...account, ...updatedAccount }
            : account
        );

        queryClient.setQueryData<Account[]>(
          queryKeys.accounts.lists(),
          newAccounts
        );
      }

      return { previousAccounts };
    },
    onError: (err, updatedAccount, context) => {
      // Rollback to previous value on error
      if (context?.previousAccounts) {
        queryClient.setQueryData(
          queryKeys.accounts.lists(),
          context.previousAccounts
        );
      }
      
      console.error('Error updating account:', err);
      toast.error('Failed to update account', {
        description: err instanceof Error ? err.message : 'Please try again later.',
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      
      toast.success('Account updated successfully!', {
        description: `${data.name} has been updated.`,
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

/**
 * Mutation hook for deleting an account
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuth();

  return useMutation({
    mutationFn: async (accountId: string) => {
      // Check for guest user restrictions
      const isGuestUser = await checkGuestAndWarn('delete accounts');
      if (isGuestUser) {
        throw new Error('Guest users cannot delete accounts');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      return deleteAccount(user.id, accountId);
    },
    onMutate: async (accountId) => {
      if (isGuest) return; // Don't do optimistic updates for guests

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.all });

      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData<Account[]>(
        queryKeys.accounts.lists()
      );

      // Optimistically remove the account
      if (previousAccounts) {
        const newAccounts = previousAccounts.filter(
          (account) => account.id !== accountId
        );

        queryClient.setQueryData<Account[]>(
          queryKeys.accounts.lists(),
          newAccounts
        );
      }

      return { previousAccounts };
    },
    onError: (err, accountId, context) => {
      // Rollback to previous value on error
      if (context?.previousAccounts) {
        queryClient.setQueryData(
          queryKeys.accounts.lists(),
          context.previousAccounts
        );
      }
      
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account', {
        description: err instanceof Error ? err.message : 'Please try again later.',
      });
    },
    onSuccess: () => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      
      toast.success('Account deleted successfully!', {
        description: 'The account has been removed.',
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}
