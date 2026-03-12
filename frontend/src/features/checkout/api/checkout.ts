/**
 * Checkout-local API boundary for order submission.
 */
import { createOrder as createOrderRequest } from '@/features/orders/api/orders';
import type { CreateOrderData, Order } from '@/shared/types';

// Sends the finalized checkout payload to the backend order endpoint.
export async function createCheckoutOrder(payload: CreateOrderData): Promise<Order> {
  return createOrderRequest(payload);
}
