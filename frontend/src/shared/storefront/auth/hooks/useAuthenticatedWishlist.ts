import { useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultStorefrontState } from '../../constants';
import { toggleWishlistProduct } from '../../api/storefrontApi';
import { storefrontStateKey, wishlistProductsKey } from '../../queryKeys';
import type { StorefrontToggleResult } from '../../types';
import { useAuthenticatedStorefrontState } from './useAuthenticatedStorefrontState';

// Authenticated wishlist state and mutations backed by the API.
export function useAuthenticatedWishlist(enabled: boolean) {
  const queryClient = useQueryClient();
  const storefrontQuery = useAuthenticatedStorefrontState(enabled);
  const ids = storefrontQuery.data?.wishlistProductIds ?? defaultStorefrontState.wishlistProductIds;

  const toggleMutation = useMutation({
    mutationFn: toggleWishlistProduct,
    onSuccess: async (data) => {
      queryClient.setQueryData(storefrontStateKey, data);
      await queryClient.invalidateQueries({ queryKey: wishlistProductsKey });
    },
  });

  return {
    ids,
    isLoading: enabled ? storefrontQuery.isLoading || toggleMutation.isPending : false,
    async toggle(productId: string): Promise<StorefrontToggleResult> {
      const response = await toggleMutation.mutateAsync(productId);

      return {
        added: response.added,
        ids: response.wishlistProductIds,
        reachedLimit: false,
      };
    },
    clear() {
      // Wishlist is toggled item-by-item in the current UX.
    },
  };
}
