import { useQuery } from '@tanstack/react-query';
import { fetchStorefrontState } from '../../api/storefrontApi';
import { storefrontStateKey } from '../../queryKeys';

// Server-backed storefront state query for authenticated customers only.
export function useAuthenticatedStorefrontState(enabled: boolean) {
  return useQuery({
    queryKey: storefrontStateKey,
    queryFn: fetchStorefrontState,
    enabled,
    staleTime: 30_000,
  });
}
