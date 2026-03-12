import { isAuthenticated } from '@/shared/auth/session';
import { defaultStorefrontState } from '../constants';
import type { StorefrontToggleResult } from '../types';
import { useAuthenticatedWishlist } from '../auth/hooks/useAuthenticatedWishlist';

export function useWishlist() {
  const authed = isAuthenticated();
  const authenticatedWishlist = useAuthenticatedWishlist(authed);

  if (!authed) {
    return {
      ids: defaultStorefrontState.wishlistProductIds,
      isLoading: false,
      async toggle(_productId: string): Promise<StorefrontToggleResult> {
        return {
          added: false,
          ids: defaultStorefrontState.wishlistProductIds,
          reachedLimit: false,
        };
      },
      clear() {
        // Guests do not have wishlist support.
      },
    };
  }

  return authenticatedWishlist;
}
