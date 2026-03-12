/**
 * Persists guest order receipts locally so anonymous customers can view confirmation details.
 */
import type { Order } from '@/shared/types';

const guestOrderStorageKey = 'guestCheckoutOrders';

type GuestOrderLookup = Record<string, Order>;

function readGuestOrderLookup(): GuestOrderLookup {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = localStorage.getItem(guestOrderStorageKey);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as GuestOrderLookup;
  } catch {
    localStorage.removeItem(guestOrderStorageKey);
    return {};
  }
}

// Stores the latest guest order snapshot by id for the confirmation page.
export function persistGuestOrder(order: Order): void {
  if (typeof window === 'undefined') {
    return;
  }

  const orders = readGuestOrderLookup();
  orders[order.id] = order;
  localStorage.setItem(guestOrderStorageKey, JSON.stringify(orders));
}

// Reads a previously stored guest order snapshot by id.
export function readGuestOrder(orderId: string): Order | null {
  return readGuestOrderLookup()[orderId] ?? null;
}
