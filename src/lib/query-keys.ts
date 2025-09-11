/**
 * Query Key Factory for consistent query key management
 * This ensures proper cache invalidation and prevents key collisions
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
    user: (userId: string) => [...queryKeys.auth.all, 'user', userId] as const,
  },

  // Transaction queries
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) => 
      [...queryKeys.transactions.lists(), filters] as const,
    details: () => [...queryKeys.transactions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
    // Filtered queries
    byCategory: (category: string) => 
      [...queryKeys.transactions.all, 'category', category] as const,
    byPeriod: (period: string) => 
      [...queryKeys.transactions.all, 'period', period] as const,
    byAccount: (accountId: string) => 
      [...queryKeys.transactions.all, 'account', accountId] as const,
  },

  // Account queries
  accounts: {
    all: ['accounts'] as const,
    lists: () => [...queryKeys.accounts.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) => 
      [...queryKeys.accounts.lists(), filters] as const,
    details: () => [...queryKeys.accounts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.accounts.details(), id] as const,
    balance: (id: string) => [...queryKeys.accounts.all, 'balance', id] as const,
  },

  // Budget queries
  budgets: {
    all: ['budgets'] as const,
    lists: () => [...queryKeys.budgets.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) => 
      [...queryKeys.budgets.lists(), filters] as const,
    details: () => [...queryKeys.budgets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.budgets.details(), id] as const,
    spending: (category: string, period: string) => 
      [...queryKeys.budgets.all, 'spending', category, period] as const,
    remaining: () => [...queryKeys.budgets.all, 'remaining'] as const,
  },

  // Goal queries
  goals: {
    all: ['goals'] as const,
    lists: () => [...queryKeys.goals.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) => 
      [...queryKeys.goals.lists(), filters] as const,
    details: () => [...queryKeys.goals.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.goals.details(), id] as const,
    progress: (id: string) => [...queryKeys.goals.all, 'progress', id] as const,
  },

  // Dashboard & Summary queries
  dashboard: {
    all: ['dashboard'] as const,
    summary: () => [...queryKeys.dashboard.all, 'summary'] as const,
    data: (userId: string) => [...queryKeys.dashboard.all, 'data', userId] as const,
  },

  // Profile queries
  profile: {
    all: ['profile'] as const,
    current: () => [...queryKeys.profile.all, 'current'] as const,
    details: (userId: string) => [...queryKeys.profile.all, userId] as const,
  },
} as const;

// Type helpers for query keys
export type QueryKeys = typeof queryKeys;
export type TransactionQueryKeys = typeof queryKeys.transactions;
export type AccountQueryKeys = typeof queryKeys.accounts;
export type BudgetQueryKeys = typeof queryKeys.budgets;
export type GoalQueryKeys = typeof queryKeys.goals;
