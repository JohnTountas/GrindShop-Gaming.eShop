import { useEffect } from 'react';

interface UseCompareSessionCleanupOptions {
  authed: boolean;
  ids: string[];
  clearGuestCompare: () => void;
  clearAuthenticatedCompare: () => void;
}

// Clears compare state when the browsing session ends.
export function useCompareSessionCleanup({
  authed,
  ids,
  clearGuestCompare,
  clearAuthenticatedCompare,
}: UseCompareSessionCleanupOptions) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let clearOnCloseTriggered = false;

    function clearOnWindowClose() {
      if (clearOnCloseTriggered) {
        return;
      }
      clearOnCloseTriggered = true;

      if (!authed) {
        clearGuestCompare();
        return;
      }

      if (ids.length === 0) {
        return;
      }

      clearAuthenticatedCompare();
    }

    window.addEventListener('beforeunload', clearOnWindowClose);
    window.addEventListener('pagehide', clearOnWindowClose);

    return () => {
      window.removeEventListener('beforeunload', clearOnWindowClose);
      window.removeEventListener('pagehide', clearOnWindowClose);
    };
  }, [authed, ids, clearAuthenticatedCompare, clearGuestCompare]);
}
