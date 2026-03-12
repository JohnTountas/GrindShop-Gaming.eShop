import type { Cart } from '@/shared/types';

// Shared callback contract for cart item mutations.
export interface CartItemMutationCallbacks {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onSettled?: () => void;
}

// Shared guest-cart callbacks used by wrapper hooks.
export interface GuestCartMutationCallbacks extends CartItemMutationCallbacks {
  onGuestCartUpdated?: (cart: Cart) => void;
}

export interface UseRemoveCartItemOptions extends GuestCartMutationCallbacks {
  authed: boolean;
  onMutate?: (itemId: string) => void;
}

export interface UseUpdateCartItemOptions extends GuestCartMutationCallbacks {
  authed: boolean;
  onMutate?: (itemId: string) => void;
}
