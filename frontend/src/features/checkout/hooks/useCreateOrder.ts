/**
 * Mutation hook for submitting checkout orders.
 */
import { useMutation } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/shared/api/error';
import type { CreateOrderData, Order } from '@/shared/types';
import { createCheckoutOrder } from '../api/checkout';

// Optional callbacks for create-order mutation behavior.
interface UseCreateOrderOptions {
  onSuccess?: (order: Order) => void;
  onError?: (message: string) => void;
}

// React Query mutation hook to submit a checkout order.
export function useCreateOrder(options: UseCreateOrderOptions = {}) {
  return useMutation({
    mutationFn: (payload: CreateOrderData) => createCheckoutOrder(payload),
    onSuccess: (order) => {
      options.onSuccess?.(order);
    },
    onError: (error) => {
      options.onError?.(getApiErrorMessage(error, 'Failed to create order'));
    },
  });
}

