/**
 * Mutation hook for updating cart item quantities.
 */
import { useAuthenticatedUpdateCartItem } from './auth/useAuthenticatedUpdateCartItem';
import { useGuestUpdateCartItem } from './guest/useGuestUpdateCartItem';
import type { UseUpdateCartItemOptions } from './types';

// React Query mutation hook to update a cart item's quantity.
export function useUpdateCartItem({
  authed,
  onGuestCartUpdated,
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: UseUpdateCartItemOptions) {
  const authenticatedMutation = useAuthenticatedUpdateCartItem({
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });
  const guestMutation = useGuestUpdateCartItem({
    onGuestCartUpdated,
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });

  return authed ? authenticatedMutation : guestMutation;
}

