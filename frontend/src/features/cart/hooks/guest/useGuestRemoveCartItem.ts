import { useMutation } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/shared/api/error';
import { readGuestCart, removeGuestCartItem } from '@/shared/cart/guestCart';
import type { UseRemoveCartItemOptions } from '../types';

type GuestRemoveOptions = Omit<UseRemoveCartItemOptions, 'authed'>;

// Local guest-cart removal for anonymous customers.
export function useGuestRemoveCartItem({
  onGuestCartUpdated,
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: GuestRemoveOptions) {
  return useMutation({
    mutationFn: async (itemId: string) => removeGuestCartItem(itemId),
    onMutate: (itemId) => {
      onMutate?.(itemId);
    },
    onSuccess: async () => {
      onGuestCartUpdated?.(readGuestCart());
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(getApiErrorMessage(error, 'Unable to remove cart item'));
    },
    onSettled: () => {
      onSettled?.();
    },
  });
}
