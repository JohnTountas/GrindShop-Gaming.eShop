import { isAuthenticated } from '@/shared/auth/session';
import { useAuthenticatedCompare } from '../auth/hooks/useAuthenticatedCompare';
import { useGuestCompare } from '../guest/hooks/useGuestCompare';
import { useCompareSessionCleanup } from './useCompareSessionCleanup';

export function useCompare() {
  const authed = isAuthenticated();
  const authenticatedCompare = useAuthenticatedCompare(authed);
  const guestCompare = useGuestCompare(!authed);
  const activeCompare = authed ? authenticatedCompare : guestCompare;

  useCompareSessionCleanup({
    authed,
    ids: activeCompare.ids,
    clearGuestCompare: guestCompare.clearOnWindowClose,
    clearAuthenticatedCompare: authenticatedCompare.clearOnWindowClose,
  });

  return {
    ids: activeCompare.ids,
    isLoading: activeCompare.isLoading,
    toggle: activeCompare.toggle,
    clear: activeCompare.clear,
  };
}
