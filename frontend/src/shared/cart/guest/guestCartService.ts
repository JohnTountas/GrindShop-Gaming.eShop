/**
 * Guest-cart operations grouped separately from authenticated cart flows.
 */
import type { Cart, Product } from '@/shared/types';
import { ensureStockAvailable, ensureValidQuantity } from '../utils/cartValidation';
import {
  buildGuestCartItem,
  clearStoredGuestCart,
  persistStoredGuestCart,
  readStoredGuestCart,
  subscribeToGuestCartUpdates,
  toGuestCart,
} from './guestCartStorage';

// Returns the current guest cart with totals computed for presentation.
export function readGuestCart(): Cart {
  return toGuestCart(readStoredGuestCart());
}

// Reports whether the browser currently holds any guest-cart lines.
export function guestCartHasItems(): boolean {
  return readStoredGuestCart().items.length > 0;
}

// Adds a product to guest-cart storage, merging quantities with an existing line when needed.
export function addGuestCartItem(product: Product, quantity: number): Cart {
  ensureValidQuantity(quantity);

  const cart = readStoredGuestCart();
  const existingItem = cart.items.find((item) => item.productId === product.id);
  const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

  ensureStockAvailable(product, nextQuantity);

  const items = existingItem
    ? cart.items.map((item) =>
        item.productId === product.id ? buildGuestCartItem(product, nextQuantity, item) : item
      )
    : [...cart.items, buildGuestCartItem(product, quantity)];

  return persistStoredGuestCart({
    ...cart,
    items,
    updatedAt: new Date().toISOString(),
  });
}

// Updates the quantity of an existing guest-cart line after stock and quantity validation.
export function updateGuestCartItem(itemId: string, quantity: number): Cart {
  ensureValidQuantity(quantity);

  const cart = readStoredGuestCart();
  const existingItem = cart.items.find((item) => item.id === itemId);

  if (!existingItem) {
    throw new Error('Cart item not found');
  }

  ensureStockAvailable(existingItem.product, quantity);

  return persistStoredGuestCart({
    ...cart,
    items: cart.items.map((item) =>
      item.id === itemId ? buildGuestCartItem(existingItem.product, quantity, existingItem) : item
    ),
    updatedAt: new Date().toISOString(),
  });
}

// Removes a guest-cart line by id and publishes the updated cart to listeners.
export function removeGuestCartItem(itemId: string): Cart {
  const cart = readStoredGuestCart();

  return persistStoredGuestCart({
    ...cart,
    items: cart.items.filter((item) => item.id !== itemId),
    updatedAt: new Date().toISOString(),
  });
}

// Clears all guest-cart lines and returns the empty runtime cart shape.
export function clearGuestCart(): Cart {
  clearStoredGuestCart();
  return toGuestCart(readStoredGuestCart());
}

// Subscribes to guest-cart updates and forwards the latest computed cart on every change.
export function subscribeToGuestCart(handler: (cart: Cart) => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const sync = () => handler(readGuestCart());
  return subscribeToGuestCartUpdates(sync);
}
