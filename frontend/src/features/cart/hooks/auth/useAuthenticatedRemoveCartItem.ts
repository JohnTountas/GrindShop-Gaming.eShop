import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/shared/api/error';
import { removeCartItem as removeCartItemApi } from '../../api/cart';
import { cartKey } from '../../queryKeys';
import type { UseRemoveCartItemOptions } from '../types';

type AuthenticatedRemoveOptions = Omit<UseRemoveCartItemOptions, 'authed' | 'onGuestCartUpdated'>;

// Server-backed cart-item removal for authenticated customers.
export function useAuthenticatedRemoveCartItem({
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: AuthenticatedRemoveOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItemApi,
    onMutate: (itemId) => {
      onMutate?.(itemId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartKey });
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
