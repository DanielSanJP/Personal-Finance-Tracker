import { createClient } from '../supabase/client';
import { dataCache } from './cache';
import type { User } from './types';

// Normalize user data to ensure consistent format
// Note: email and display_name should always come from auth, not database
const normalizeUserData = (userData: {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  initials?: string;
  avatar?: string | null;
  [key: string]: unknown;
}): Omit<User, 'email' | 'display_name'> => {
  const firstName = userData.firstName || userData.first_name || '';
  const lastName = userData.lastName || userData.last_name || '';
  const initials = userData.initials || 
                   `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';

  return {
    id: userData.id,
    first_name: firstName,
    last_name: lastName,
    initials: initials,
    avatar: userData.avatar || null,
    // Legacy support
    firstName,
    lastName,
  };
};

// Get current authenticated user with caching
export const getCurrentUser = async (): Promise<User | null> => {
  // Check cache first
  const cachedUser = dataCache.getUser();
  if (cachedUser !== undefined) {
    return cachedUser;
  }

  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!error && user) {
      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      let userData: User;
      if (profileError || !profile) {
        // If no profile exists, return the auth user data
        userData = {
          id: user.id,
          email: user.email || '', // Always from auth
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || '', // Always from auth
          initials: `${user.user_metadata?.first_name?.[0] || ''}${user.user_metadata?.last_name?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U',
          avatar: user.user_metadata?.avatar || null
        };
      } else {
        // Merge auth data with profile data, always using auth for email and display_name
        userData = {
          ...normalizeUserData(profile),
          email: user.email || '', // Override with auth email
          display_name: user.user_metadata?.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email || '', // Override with auth display_name
        };
      }
      
      // Cache the result
      dataCache.setUser(userData);
      return userData;
    }

    // Cache null result
    dataCache.setUser(null);
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    // Don't cache errors, allow retry
    return null;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const supabase = createClient();
    
    // Get both auth user and profile data
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profileData) return null;

    // We can only return complete user data if this is the current authenticated user
    if (authUser?.id === userId) {
      return {
        ...normalizeUserData(profileData),
        email: authUser.email || '',
        display_name: authUser.user_metadata?.display_name || `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || authUser.email || '',
      };
    }

    // For other users, we can only return basic profile info (no email/display_name)
    return {
      ...normalizeUserData(profileData),
      email: '', // Not available for other users
      display_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User',
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Guest account constant
export const GUEST_USER_ID = '55e3b0e6-b683-4cab-aa5b-6a5b192bde7d';

// Check if current user is guest
export const isGuestUser = (user: User | null): boolean => {
  return user?.id === GUEST_USER_ID;
};

// Clear user cache (useful for logout)
export const clearUserCache = (): void => {
  dataCache.clearUser();
};
