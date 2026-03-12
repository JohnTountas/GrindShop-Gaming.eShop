import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/shared/api/error';
import { updateCartItem as updateCartItemApi } from '../../api/cart';
import { cartKey } from '../../queryKeys';
import type { UseUpdateCartItemOptions } from '../types';

type AuthenticatedUpdateOptions = Omit<UseUpdateCartItemOptions, 'authed' | 'onGuestCartUpdated'>;

// Server-backed cart quantity updates for authenticated customers.
export function useAuthenticatedUpdateCartItem({
  onMutate,
  onSuccess,
  onError,
  onSettled,
}: AuthenticatedUpdateOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemApi(itemId, quantity),
    onMutate: (payload) => {
      onMutate?.(payload.itemId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartKey });
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
