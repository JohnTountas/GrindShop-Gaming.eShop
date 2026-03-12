/**
 * Mutation hook for removing cart items.
 */
import { useAuthenticatedRemoveCartItem } from './auth/useAuthenticatedRemoveCartItem';
import { useGuestRemoveCartItem } from './guest/useGuestRemoveCartItem';
import type { UseRemoveCartItemOptions } from './types';

// React Query mutation hook to remove a cart item.
export function useRemoveCartItem({
  authed,
  onGuestCartUpdated,
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: UseRemoveCartItemOptions) {
  const authenticatedMutation = useAuthenticatedRemoveCartItem({
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });
  const guestMutation = useGuestRemoveCartItem({
    onGuestCartUpdated,
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });

  return authed ? authenticatedMutation : guestMutation;
}

