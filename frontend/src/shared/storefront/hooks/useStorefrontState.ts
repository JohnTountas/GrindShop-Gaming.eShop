import { isAuthenticated } from '@/shared/auth/session';
import { defaultStorefrontState } from '../constants';
import { useAuthenticatedStorefrontState } from '../auth/hooks/useAuthenticatedStorefrontState';

export function useStorefrontState() {
  const authed = isAuthenticated();
  const storefrontQuery = useAuthenticatedStorefrontState(authed);

  return {
    ...storefrontQuery,
    data: authed ? storefrontQuery.data : defaultStorefrontState,
    isLoading: authed ? storefrontQuery.isLoading : false,
    isError: authed ? storefrontQuery.isError : false,
  };
}
