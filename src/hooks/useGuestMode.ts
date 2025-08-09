"use client";

import { useState, useEffect } from 'react';

export const useGuestMode = () => {
  const [isGuest, setIsGuest] = useState<boolean | null>(null);

  useEffect(() => {
    const checkGuestMode = () => {
      if (typeof window !== 'undefined') {
        const guestMode = localStorage.getItem('guestMode') === 'true';
        console.log('🔍 useGuestMode: Checking localStorage...', {
          guestModeValue: localStorage.getItem('guestMode'),
          isGuest: guestMode
        });
        setIsGuest(guestMode);
      } else {
        console.log('🔍 useGuestMode: Window not available (SSR)');
      }
    };

    checkGuestMode();

    // Also listen for storage changes and custom events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'guestMode') {
        console.log('🔍 useGuestMode: Storage change detected', e.newValue);
        checkGuestMode();
      }
    };

    const handleGuestModeChange = (e: CustomEvent) => {
      console.log('🔍 useGuestMode: Custom event detected', e.detail);
      checkGuestMode();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('guestModeChanged', handleGuestModeChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('guestModeChanged', handleGuestModeChange as EventListener);
    };
  }, []);

  return isGuest;
};
