import accountsData from '@/data/accounts.json';
import { createClient } from '../supabase/client';
import { getCurrentUser, isGuestMode } from './auth';
import type { Account } from './types';

// Account functions
export const getCurrentUserAccounts = async (): Promise<Account[]> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return [];
  }
  
  // Use static data for guest user, Supabase for authenticated users
  const guestModeActive = isGuestMode();
  
  if (guestModeActive) {
    return accountsData.accounts.filter(account => account.userId === user.id);
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
      return [];
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
};

export const getAccountsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return accountsData.accounts.filter(account => account.userId === userId);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching accounts by user ID:', error);
      return [];
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
};

// Account creation function
export const createAccount = async (accountData: {
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (isGuestMode()) {
    // In guest mode, we can't actually create accounts in the database
    // Just return a success message for demo purposes
    return {
      success: true,
      message: 'Account created successfully (demo mode)',
      account: {
        id: `acc_${Date.now()}`,
        userId: user.id,
        name: accountData.name,
        balance: accountData.balance,
        type: accountData.type,
        accountNumber: accountData.accountNumber || '',
        isActive: true
      }
    };
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
      throw new Error('Failed to create account');
    }

    return {
      success: true,
      message: 'Account created successfully',
      account: {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        balance: Number(data.balance),
        type: data.type,
        accountNumber: data.account_number || '',
        isActive: data.is_active
      }
    };
  } catch (error) {
    console.error('Error in createAccount:', error);
    throw error;
  }
};

// Utility function for total balance calculation
export const getTotalBalance = async () => {
  const accounts = await getCurrentUserAccounts();
  return accounts.reduce((total: number, account: Account) => total + account.balance, 0);
};
