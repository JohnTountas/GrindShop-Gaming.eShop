import api from '@/shared/api/client';

// Persists one guest-cart line into the authenticated server cart.
export async function syncGuestCartItem(productId: string, quantity: number) {
  await api.post('/cart/items', {
    productId,
    quantity,
  });
}
