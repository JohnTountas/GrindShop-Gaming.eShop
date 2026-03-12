import { useMutation } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/shared/api/error';
import { readGuestCart, updateGuestCartItem } from '@/shared/cart/guestCart';
import type { UseUpdateCartItemOptions } from '../types';

type GuestUpdateOptions = Omit<UseUpdateCartItemOptions, 'authed'>;

// Local guest-cart quantity updates for anonymous customers.
export function useGuestUpdateCartItem({
  onGuestCartUpdated,
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: GuestUpdateOptions) {
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateGuestCartItem(itemId, quantity),
    onMutate: (payload) => {
      onMutate?.(payload.itemId);
    },
    onSuccess: async () => {
      onGuestCartUpdated?.(readGuestCart());
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(getApiErrorMessage(error, 'Unable to update cart item'));
    },
    onSettled: () => {
      onSettled?.();
    },
  });
}
