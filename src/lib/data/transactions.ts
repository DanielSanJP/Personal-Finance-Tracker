import { createClient } from '../supabase/client';
import { getCurrentUser } from './auth';
import { formatDateForDatabase } from './utils';
import type { Transaction } from './types';

// Transaction functions
export const getCurrentUserTransactions = async (): Promise<Transaction[]> => {
  const user = await getCurrentUser();
  if (!user) return [];
  
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

export const getTransactionsByUserId = async (userId: string): Promise<Transaction[]> => {
  
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

// Transaction creation function
export const createTransaction = async (transactionData: {
  type: string;
  amount: number;
  description: string;
  category?: string;
  merchant?: string;
  accountId: string;
  status?: string;
  date: Date;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
    // Generate a unique ID for the transaction
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        id: transactionId,
        user_id: user.id,
        account_id: transactionData.accountId,
        date: formatDateForDatabase(transactionData.date), // Format as YYYY-MM-DD in local timezone
        description: transactionData.description,
        amount: transactionData.amount,
        category: transactionData.category || null,
        type: transactionData.type,
        merchant: transactionData.merchant || null,
        status: transactionData.status || 'completed'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create transaction');
    }

    return {
      success: true,
      message: 'Transaction created successfully',
      transaction: {
        id: data.id,
        userId: data.user_id,
        accountId: data.account_id,
        date: data.date,
        description: data.description,
        amount: Number(data.amount),
        category: data.category || '',
        type: data.type,
        merchant: data.merchant || '',
        status: data.status
      }
    };
  } catch (error) {
    console.error('Error in createTransaction:', error);
    throw error;
  }
};

// Income-specific transaction creation function
export const createIncomeTransaction = async (incomeData: {
  amount: number;
  description: string;
  source: string; // Income source (Salary, Freelance, etc.)
  accountId: string;
  date: Date;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
    // Use the database function to handle both transaction creation and balance update atomically
    const { data: transaction, error: transactionError } = await supabase.rpc('create_income_transaction', {
      p_user_id: user.id,
      p_account_id: incomeData.accountId,
      p_amount: Math.abs(incomeData.amount), // Ensure positive amount for income
      p_description: incomeData.description,
      p_category: incomeData.source,
      p_merchant: incomeData.source,
      p_date: formatDateForDatabase(incomeData.date)
    });

    if (transactionError) {
      console.error('Error creating income transaction:', transactionError);
      throw new Error('Failed to create income transaction');
    }

    return {
      success: true,
      message: 'Income added successfully and account balance updated',
      transaction: transaction
    };
  } catch (error) {
    console.error('Error in createIncomeTransaction:', error);
    throw error;
  }
};

// Expense-specific transaction creation function  
export const createExpenseTransaction = async (expenseData: {
  amount: number;
  description: string;
  category?: string;
  merchant?: string;
  accountId: string;
  status?: string;
  date: Date;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
    // Use the database function to handle both transaction creation and balance update atomically
    const { data: transaction, error: transactionError } = await supabase.rpc('create_expense_transaction', {
      p_user_id: user.id,
      p_account_id: expenseData.accountId,
      p_amount: Math.abs(expenseData.amount), // Ensure positive amount for calculation
      p_description: expenseData.description,
      p_category: expenseData.category || null,
      p_merchant: expenseData.merchant || null,
      p_date: formatDateForDatabase(expenseData.date),
      p_status: expenseData.status || 'completed'
    });

    if (transactionError) {
      console.error('Error creating expense transaction:', transactionError);
      throw new Error('Failed to create expense transaction');
    }

    return {
      success: true,
      message: 'Expense added successfully and account balance updated',
      transaction: transaction
    };
  } catch (error) {
    console.error('Error in createExpenseTransaction:', error);
    throw error;
  }
};

// Transaction utility functions
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

// Calculate monthly income from transactions
export const getMonthlyIncome = async () => {
  const monthlyTransactions = await getCurrentMonthTransactions();
  
  return monthlyTransactions
    .filter((transaction: Transaction) => transaction.type === 'income')
    .reduce((total: number, transaction: Transaction) => total + Math.abs(transaction.amount), 0);
};

// Calculate monthly expenses from transactions
export const getMonthlyExpenses = async () => {
  const monthlyTransactions = await getCurrentMonthTransactions();
  
  return monthlyTransactions
    .filter((transaction: Transaction) => transaction.type === 'expense')
    .reduce((total: number, transaction: Transaction) => total + Math.abs(transaction.amount), 0);
};

// Calculate monthly spending (same as expenses, for clarity)
export const getMonthlySpending = async () => {
  return await getMonthlyExpenses();
};

// Monthly income and expense calculation functions
export const getCurrentMonthIncome = async (): Promise<number> => {
  const monthlyTransactions = await getCurrentMonthTransactions();
  
  return monthlyTransactions
    .filter((transaction: Transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
};

export const getCurrentMonthExpenses = async (): Promise<number> => {
  const monthlyTransactions = await getCurrentMonthTransactions();
  
  return monthlyTransactions
    .filter((transaction: Transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
};
