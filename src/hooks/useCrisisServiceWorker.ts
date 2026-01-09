/**
 * Hook for registering and managing Service Worker for offline crisis resources
 */

import { useEffect, useState } from 'react';

export const useCrisisResourcesServiceWorker = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Service Workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return;
    }

    // Register Service Worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/crisis-resources-sw.js', {
          scope: '/',
        });
        console.log('Crisis Resources Service Worker registered:', registration);
        setIsRegistered(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to register Service Worker:', errorMessage);
        setError(errorMessage);
      }
    };

    registerServiceWorker();
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Back online - Crisis resources available');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Offline - Using cached crisis resources');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isRegistered,
    isOnline,
    error,
  };
};

/**
 * Hook to show offline indicator when Service Worker cached resources are being used
 */
export const useOfflineIndicator = () => {
  const { isOnline } = useCrisisResourcesServiceWorker();
  return !isOnline;
};
