import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const GUEST_USER_ID = '55e3b0e6-b683-4cab-aa5b-6a5b192bde7d';

/**
 * Check if current user is the guest user
 */
export const isCurrentUserGuest = async (): Promise<boolean> => {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id === GUEST_USER_ID;
  } catch {
    return false;
  }
};

/**
 * Check if user is guest and show appropriate message if they try to perform write operations
 * Returns true if user is guest (should prevent action), false if user can proceed
 */
export const checkGuestAndWarn = async (action: string = 'perform this action'): Promise<boolean> => {
  const isGuest = await isCurrentUserGuest();
  
  if (isGuest) {
    toast.error('Guest Mode - Read Only', {
      description: `Guest users cannot ${action}. Please create an account to manage your own data.`,
      duration: 4000,
    });
    return true; // User is guest, should prevent action
  }
  
  return false; // User is not guest, can proceed
};
