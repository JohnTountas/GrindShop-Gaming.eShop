/**
 * Checkout-specific derived values for totals, previews, and submission metadata.
 */
import type { CartItem, ShippingAddress } from '@/shared/types';
import type { CardPaymentDetails, PaymentMethod } from '../types';
import { getCardLastFour } from './formatters';

// Computed pricing breakdown displayed across checkout.
export interface CheckoutTotals {
  subtotal: number;
  shippingEstimate: number;
  taxEstimate: number;
  totalEstimate: number;
}

// Snapshot of the currently selected payment inputs.
export interface CheckoutPaymentSnapshot {
  selectedPaymentMethod: PaymentMethod;
  cardDetails: CardPaymentDetails;
  walletEmail: string;
  bankTransferReference: string;
}

// Returns the aggregate pricing values used by checkout summaries.
export function calculateCheckoutTotals(items: CartItem[]): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const shippingEstimate = subtotal >= 100 ? 0 : 3.5;
  const taxEstimate = subtotal * 0.24;

  return {
    subtotal,
    shippingEstimate,
    taxEstimate,
    totalEstimate: subtotal + shippingEstimate + taxEstimate,
  };
}

// Detects whether every required delivery-address field has a value.
export function isShippingAddressComplete(address: ShippingAddress) {
  return Object.values(address).every((value) => value.trim().length > 0);
}

// Produces the order-confirmation preview text shown before submission.
export function buildPaymentPreview({
  selectedPaymentMethod,
  cardDetails,
  walletEmail,
  bankTransferReference,
}: CheckoutPaymentSnapshot) {
  if (selectedPaymentMethod === 'CARD') {
    const cardLastFour = getCardLastFour(cardDetails.number);
    return cardLastFour ? `Card ending in ${cardLastFour}` : 'Card details pending';
  }

  if (selectedPaymentMethod === 'BANK_TRANSFER') {
    return bankTransferReference.trim()
      ? `Reference ${bankTransferReference.trim()}`
      : 'Reference pending';
  }

  return walletEmail.trim() ? `Wallet ${walletEmail.trim()}` : 'Wallet email pending';
}

// Selects the payment-input value used for payment-intent fingerprinting.
export function getPaymentFingerprintSource({
  selectedPaymentMethod,
  cardDetails,
  walletEmail,
  bankTransferReference,
}: CheckoutPaymentSnapshot) {
  if (selectedPaymentMethod === 'CARD') {
    return cardDetails.number;
  }

  if (selectedPaymentMethod === 'BANK_TRANSFER') {
    return bankTransferReference;
  }

  return walletEmail;
}
