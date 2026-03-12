/**
 * Shared cart data hook that supports authenticated and guest carts.
 */
import { isAuthenticated } from '@/shared/auth/session';
import { useAuthenticatedCartData } from './auth/useAuthenticatedCartData';
import { useGuestCartData } from './guest/useGuestCartData';

// Provides a unified cart view for authenticated users and guests.
export function useCartData() {
  const authed = isAuthenticated();
  const guestCart = useGuestCartData(!authed);
  const cartQuery = useAuthenticatedCartData(authed);

  return {
    authed,
    cart: authed ? cartQuery.data : guestCart,
    isLoading: authed ? cartQuery.isLoading : false,
    isError: authed ? cartQuery.isError : false,
    error: cartQuery.error,
    refetch: cartQuery.refetch,
  };
}

