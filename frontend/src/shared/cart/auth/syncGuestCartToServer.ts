/**
 * Authenticated cart sync that migrates guest cart lines into the member cart.
 */
import type { GuestCartSyncResult } from '../types';
import { removeGuestCartItem } from '../guest/guestCartService';
import { readStoredGuestCart } from '../guest/guestCartStorage';
import { syncGuestCartItem } from './api/syncGuestCartItem';

// Pushes persisted guest-cart lines into the authenticated server cart after sign-in.
export async function syncGuestCartToServer(): Promise<GuestCartSyncResult> {
  const items = [...readStoredGuestCart().items];
  let syncedCount = 0;

  for (const item of items) {
    try {
      await syncGuestCartItem(item.productId, item.quantity);
      removeGuestCartItem(item.id);
      syncedCount += 1;
    } catch {
      // Unsynced lines stay in local storage so the customer does not lose their cart.
    }
  }

  return {
    syncedCount,
    remainingCount: readStoredGuestCart().items.length,
  };
}
