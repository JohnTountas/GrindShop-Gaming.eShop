import { useEffect, useState } from 'react';
import { readGuestCart, subscribeToGuestCart } from '@/shared/cart/guestCart';
import type { Cart } from '@/shared/types';

// Local-storage cart snapshot used only for guest customers.
export function useGuestCartData(enabled: boolean) {
  const [guestCart, setGuestCart] = useState<Cart>(() => readGuestCart());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setGuestCart(readGuestCart());
    return subscribeToGuestCart(setGuestCart);
  }, [enabled]);

  return guestCart;
}
