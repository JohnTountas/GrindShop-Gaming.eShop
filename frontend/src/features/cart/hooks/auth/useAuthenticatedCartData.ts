import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../api/cart';
import { cartKey } from '../../queryKeys';

// Server-backed cart query used only for authenticated customers.
export function useAuthenticatedCartData(enabled: boolean) {
  return useQuery({
    queryKey: cartKey,
    queryFn: getCart,
    enabled,
  });
}
