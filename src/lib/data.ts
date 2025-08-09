import usersData from '@/data/users.json';
import accountsData from '@/data/accounts.json';
import transactionsData from '@/data/transactions.json';
import budgetsData from '@/data/budgets.json';
import goalsData from '@/data/goals.json';
import summaryData from '@/data/summary.json';
import { createClient } from './supabase/client';

// Type definitions
interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: string;
  accountNumber: string;
  isActive: boolean;
}

interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  merchant: string;
  status: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  displayName?: string;
  display_name?: string;
  initials?: string;
  avatar?: string | null;
}

// Check if user is in guest mode
const isGuestMode = () => {
  if (typeof window !== 'undefined') {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    console.log('🔍 Guest mode check:', { guestMode, localStorage: localStorage.getItem('guestMode') });
    return guestMode;
  }
  console.log('🔍 Guest mode check: SSR context, returning false');
  return false;
};

// Clear guest mode
export const clearGuestMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guestMode');
    console.log('🔍 Guest mode cleared');
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('guestModeChanged', { detail: false }));
  }
};

// Set guest mode
export const setGuestMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guestMode', 'true');
    console.log('🔍 Guest mode set');
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('guestModeChanged', { detail: true }));
  }
};

// User functions
export const getCurrentUser = async (): Promise<User | null> => {
  console.log('🔍 getCurrentUser called');
  
  // Check guest mode first before any Supabase calls
  const guestModeActive = isGuestMode();
  console.log('🔍 Guest mode active:', guestModeActive);
  
  if (guestModeActive) {
    console.log('🔍 Returning guest user:', usersData.users[0]);
    return usersData.users[0];
  }
  
  try {
    console.log('🔍 Creating Supabase client...');
    const supabase = createClient();
    
    console.log('🔍 Getting user from Supabase...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    console.log('🔍 Supabase auth result:', { user: user?.id, error: error?.message });
    
    if (error || !user) {
      console.log('🔍 No authenticated user found');
      return null;
    }

    // If we have a real authenticated user, clear guest mode
    console.log('🔍 Authenticated user found, clearing guest mode if set');
    clearGuestMode();

    console.log('🔍 Getting user profile from database for user:', user.id);
    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('🔍 Profile query result:', { profile, error: profileError?.message });
    
    if (profileError || !profile) {
      console.log('🔍 No profile found in database, returning basic user info');
      // If no profile exists, return the auth user data
      return {
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || '',
        initials: `${user.user_metadata?.first_name?.[0] || ''}${user.user_metadata?.last_name?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
      };
    }
    
    return profile;
  } catch (error) {
    console.error('🔥 Error getting current user:', error);
    
    // Fallback to guest mode if there's an error
    const guestModeActive = isGuestMode();
    console.log('🔍 Error occurred, guest mode active:', guestModeActive);
    
    if (guestModeActive) {
      console.log('🔍 Returning guest user due to error:', usersData.users[0]);
      return usersData.users[0];
    }
    
    return null;
  }
};

export const getUserById = async (userId: string) => {
  if (isGuestMode()) {
    return usersData.users.find(user => user.id === userId);
  }
  
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return data;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Account functions
export const getCurrentUserAccounts = async (): Promise<Account[]> => {
  console.log('🔍 getCurrentUserAccounts called');
  
  const user = await getCurrentUser();
  console.log('🔍 Current user for accounts:', user?.id);
  
  if (!user) {
    console.log('🔍 No user found, returning empty accounts');
    return [];
  }
  
  const guestModeActive = isGuestMode();
  console.log('🔍 Guest mode for accounts:', guestModeActive);
  
  if (guestModeActive) {
    const guestAccounts = accountsData.accounts.filter(account => account.userId === user.id);
    console.log('🔍 Returning guest accounts:', guestAccounts);
    return guestAccounts;
  }
  
  try {
    console.log('🔍 Fetching accounts from Supabase for user:', user.id);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    console.log('🔍 Supabase accounts result:', { data, error: error?.message });

    if (error) {
      console.error('🔥 Error fetching accounts:', error);
      return [];
    }

    // Map database fields to our interface
    const mappedAccounts = (data || []).map(account => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      balance: Number(account.balance),
      type: account.type,
      accountNumber: account.account_number || '',
      isActive: account.is_active
    }));
    
    console.log('🔍 Mapped accounts:', mappedAccounts);
    return mappedAccounts;
  } catch (error) {
    console.error('🔥 Error in getCurrentUserAccounts:', error);
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

// Transaction functions
export const getCurrentUserTransactions = async (): Promise<Transaction[]> => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  if (isGuestMode()) {
    return transactionsData.transactions.filter(transaction => transaction.userId === user.id);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    // Map database fields to our interface
    return (data || []).map(transaction => ({
      id: transaction.id,
      userId: transaction.user_id,
      accountId: transaction.account_id,
      date: transaction.date,
      description: transaction.description,
      amount: Number(transaction.amount),
      category: transaction.category || '',
      type: transaction.type,
      merchant: transaction.merchant || '',
      status: transaction.status || 'completed'
    }));
  } catch (error) {
    console.error('Error in getCurrentUserTransactions:', error);
    return [];
  }
};

export const getTransactionsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return transactionsData.transactions.filter(transaction => transaction.userId === userId);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions by user ID:', error);
      return [];
    }

    return (data || []).map(transaction => ({
      id: transaction.id,
      userId: transaction.user_id,
      accountId: transaction.account_id,
      date: transaction.date,
      description: transaction.description,
      amount: Number(transaction.amount),
      category: transaction.category || '',
      type: transaction.type,
      merchant: transaction.merchant || '',
      status: transaction.status || 'completed'
    }));
  } catch (error) {
    console.error('Error in getTransactionsByUserId:', error);
    return [];
  }
};

// Budget functions
export const getCurrentUserBudgets = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  if (isGuestMode()) {
    return budgetsData.budgets.filter(budget => budget.userId === user.id);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCurrentUserBudgets:', error);
    return [];
  }
};

export const getBudgetsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return budgetsData.budgets.filter(budget => budget.userId === userId);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching budgets by user ID:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBudgetsByUserId:', error);
    return [];
  }
};

// Goal functions
export const getCurrentUserGoals = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  if (isGuestMode()) {
    return goalsData.goals.filter(goal => goal.userId === user.id);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCurrentUserGoals:', error);
    return [];
  }
};

export const getGoalsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return goalsData.goals.filter(goal => goal.userId === userId);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching goals by user ID:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getGoalsByUserId:', error);
    return [];
  }
};

// Summary functions
export const getCurrentUserSummary = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  if (isGuestMode()) {
    // For guest mode, return the single summary if it matches the user
    if (summaryData.summary.userId === user.id) {
      return summaryData.summary;
    }
    return null;
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('summary')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching summary:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentUserSummary:', error);
    return null;
  }
};

export const getSummaryByUserId = async (userId: string) => {
  if (isGuestMode()) {
    if (summaryData.summary.userId === userId) {
      return summaryData.summary;
    }
    return null;
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('summary')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching summary by user ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSummaryByUserId:', error);
    return null;
  }
};

// Utility functions
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getCurrentMonthName = () => {
  return new Date().toLocaleString('default', { month: 'long' });
};

export const getTotalBalance = async () => {
  const accounts = await getCurrentUserAccounts();
  return accounts.reduce((total: number, account: Account) => total + account.balance, 0);
};

export const getCurrentMonthTransactions = async () => {
  const transactions = await getCurrentUserTransactions();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions.filter((transaction: Transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
};

export const getPreviousMonthTransactions = async () => {
  const transactions = await getCurrentUserTransactions();
  const previousMonth = new Date().getMonth() - 1;
  const currentYear = new Date().getFullYear();
  
  return transactions.filter((transaction: Transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === previousMonth && 
           transactionDate.getFullYear() === currentYear;
  });
};
