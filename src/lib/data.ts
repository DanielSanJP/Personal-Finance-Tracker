import usersData from '@/data/users.json';
import accountsData from '@/data/accounts.json';
import transactionsData from '@/data/transactions.json';
import budgetsData from '@/data/budgets.json';
import goalsData from '@/data/goals.json';
import summaryData from '@/data/summary.json';
import { supabase } from './supabase';

// Check if user is in guest mode
const isGuestMode = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('guestMode') === 'true';
  }
  return false;
};

// User functions
export const getCurrentUser = async () => {
  if (isGuestMode()) {
    return usersData.users[0]; // Return sample user for guest mode
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, return basic user info from auth
      return {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        display_name: user.user_metadata?.display_name || user.email,
        initials: user.user_metadata?.initials || user.email?.[0]?.toUpperCase() || '?',
        avatar: null,
        created_at: user.created_at
      };
    }

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

export const getUserById = async (userId: string) => {
  if (isGuestMode()) {
    return usersData.users.find(user => user.id === userId);
  }
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return data;
};

// Account functions
export const getAccountsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return accountsData.accounts.filter(account => account.userId === userId);
  }

  const { data } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);

  return data || [];
};

export const getCurrentUserAccounts = async () => {
  if (isGuestMode()) {
    const currentUser = usersData.users[0];
    return accountsData.accounts.filter(account => account.userId === currentUser.id);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return getAccountsByUserId(user.id);
};

// Transaction functions
export const getTransactionsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return transactionsData.transactions.filter(transaction => transaction.userId === userId);
  }

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  return data || [];
};

export const getCurrentUserTransactions = async () => {
  if (isGuestMode()) {
    const currentUser = usersData.users[0];
    return transactionsData.transactions.filter(transaction => transaction.userId === currentUser.id);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return getTransactionsByUserId(user.id);
};

export const getTransactionsByAccountId = async (accountId: string) => {
  if (isGuestMode()) {
    return transactionsData.transactions.filter(transaction => transaction.accountId === accountId);
  }

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('date', { ascending: false });

  return data || [];
};

// Budget functions
export const getBudgetsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return budgetsData.budgets.filter(budget => budget.userId === userId);
  }

  const { data } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);

  return data || [];
};

export const getCurrentUserBudgets = async () => {
  if (isGuestMode()) {
    const currentUser = usersData.users[0];
    return budgetsData.budgets.filter(budget => budget.userId === currentUser.id);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return getBudgetsByUserId(user.id);
};

// Goal functions
export const getGoalsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return goalsData.goals.filter(goal => goal.userId === userId);
  }

  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId);

  return data || [];
};

export const getCurrentUserGoals = async () => {
  if (isGuestMode()) {
    const currentUser = usersData.users[0];
    return goalsData.goals.filter(goal => goal.userId === currentUser.id);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return getGoalsByUserId(user.id);
};

// Summary functions
export const getCurrentUserSummary = async () => {
  if (isGuestMode()) {
    return summaryData.summary;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('summary')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
};

// Helper functions
export const getTotalBalanceForUser = async (userId: string) => {
  const accounts = await getAccountsByUserId(userId);
  return accounts.reduce((total, account) => total + account.balance, 0);
};

export const getMonthlyExpensesForUser = async (userId: string) => {
  const transactions = await getTransactionsByUserId(userId);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear &&
           transaction.amount < 0;
  });
};

export const getMonthlyIncomeForUser = async (userId: string) => {
  const transactions = await getTransactionsByUserId(userId);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear &&
           transaction.amount > 0;
  });
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Get current month name
export const getCurrentMonthName = () => {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
};
