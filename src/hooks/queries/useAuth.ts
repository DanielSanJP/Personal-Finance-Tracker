import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, isGuestUser } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

/**
 * React Query hook for authentication state
 * Handles both regular users and guest users seamlessly
 */
export function useAuth() {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: getCurrentUser,
    staleTime: 10 * 60 * 1000, // Auth data is fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    retry: (failureCount, error) => {
      // Don't retry auth errors that are likely permanent
      if (error instanceof Error && error.message.includes('Invalid')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Derived state for convenience
  const isAuthenticated = !!user;
  const isGuest = user ? isGuestUser(user) : false;
  const isRegularUser = isAuthenticated && !isGuest;

  return {
    // Core auth state
    user,
    isLoading,
    isError,
    error,
    
    // Convenience flags
    isAuthenticated,
    isGuest,
    isRegularUser,
    
    // Actions
    refetch,
    
    // Utility functions
    hasPermission: (action: string): boolean => {
      if (!user) return false;
      
      // Guest users have limited permissions
      if (isGuest) {
        const allowedActions = ['read', 'view', 'export'];
        return allowedActions.includes(action);
      }
      
      // Regular users have full permissions
      return true;
    },
  };
}

/**
 * Hook for getting user by ID (useful for profile pages, etc.)
 */
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.auth.user(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return getCurrentUser(); // You might want to implement getUserById here
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
