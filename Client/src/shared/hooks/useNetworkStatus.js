import { useState, useEffect } from 'react';
import { offlineSyncService } from '../services/offlineSyncService';

// Dev override modes: null = automatic, 'live' = force live API, 'mock' = force mock fallback
let devModeOverride = null;

export const setDevModeOverride = (mode) => {
  devModeOverride = mode;
  console.log(`[NetworkStatus] Dev Mode Override set to: ${mode || 'Automatic'}`);
};

export const getDevModeOverride = () => devModeOverride;

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // Check health endpoint on API Gateway to determine real connectivity
    const checkConnectivity = async () => {
      if (devModeOverride === 'mock') {
        if (isMounted) setIsOnline(false);
        return;
      }
      if (devModeOverride === 'live') {
        if (isMounted) setIsOnline(true);
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch('https://onemedical-gateway.onrender.com/healthz', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (isMounted) setIsOnline(res.ok);
      } catch {
        if (isMounted) setIsOnline(false);
      }
    };

    const updatePendingCount = async () => {
      const count = await offlineSyncService.getPendingCount();
      if (isMounted) setPendingSyncCount(count);
    };

    checkConnectivity();
    updatePendingCount();

    const interval = setInterval(() => {
      checkConnectivity();
      updatePendingCount();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    pendingSyncCount,
    devModeOverride,
    setDevModeOverride,
  };
};
