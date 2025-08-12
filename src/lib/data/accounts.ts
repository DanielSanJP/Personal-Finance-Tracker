import { createClient } from '../supabase/client';
import { getCurrentUser } from './auth';
import type { Account } from './types';

// Account functions
export const getCurrentUserAccounts = async (): Promise<Account[]> => {
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

// Update an existing account
export const updateAccount = async (accountId: string, accountData: {
  name?: string;
  balance?: number;
  type?: string;
  accountNumber?: string;
  isActive?: boolean;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
    // Prepare update data with only provided fields
    const updateData: Record<string, unknown> = {};
    if (accountData.name !== undefined) updateData.name = accountData.name;
    if (accountData.balance !== undefined) updateData.balance = accountData.balance;
    if (accountData.type !== undefined) updateData.type = accountData.type;
    if (accountData.accountNumber !== undefined) updateData.account_number = accountData.accountNumber;
    if (accountData.isActive !== undefined) updateData.is_active = accountData.isActive;

    const { data, error } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', accountId)
      .eq('user_id', user.id) // Ensure user can only update their own accounts
      .select()
      .single();

    if (error) {
      console.error('Error updating account:', error);
      throw new Error('Failed to update account');
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
    console.error('Error in updateAccount:', error);
    throw error;
  }
};

// Utility function for total balance calculation
export const getTotalBalance = async () => {
  const accounts = await getCurrentUserAccounts();
  return accounts.reduce((total: number, account: Account) => total + account.balance, 0);
};
