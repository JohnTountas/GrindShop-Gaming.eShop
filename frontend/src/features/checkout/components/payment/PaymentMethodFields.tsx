/**
 * Conditional payment-field renderer for the selected payment method.
 */
import type { CardPaymentDetails, PaymentMethod } from '../../types';
import { CheckoutTextField } from '../forms/CheckoutTextField';

interface PaymentMethodFieldsProps {
  selectedPaymentMethod: PaymentMethod;
  selectedPaymentLabel: string;
  cardDetails: CardPaymentDetails;
  walletEmail: string;
  bankTransferReference: string;
  paymentInputsLocked: boolean;
  isMissingValue: (value: string) => boolean;
  getInputClass: (value: string, highlightMissing?: boolean) => string;
  onCardHolderNameChange: (value: string) => void;
  onCardNumberChange: (value: string) => void;
  onCardExpiryChange: (value: string) => void;
  onCardCvvChange: (value: string) => void;
  onWalletEmailChange: (value: string) => void;
  onBankTransferReferenceChange: (value: string) => void;
}

// Displays the inputs that belong to the currently selected payment flow.
export function PaymentMethodFields({
  selectedPaymentMethod,
  selectedPaymentLabel,
  cardDetails,
  walletEmail,
  bankTransferReference,
  paymentInputsLocked,
  isMissingValue,
  getInputClass,
  onCardHolderNameChange,
  onCardNumberChange,
  onCardExpiryChange,
  onCardCvvChange,
  onWalletEmailChange,
  onBankTransferReferenceChange,
}: PaymentMethodFieldsProps) {
  if (selectedPaymentMethod === 'CARD') {
    return (
      <div className="grid gap-4 rounded-2xl border border-primary-300/70 bg-primary-100/72 p-4 sm:grid-cols-2">
        <CheckoutTextField
          id="cardHolderName"
          name="cardHolderName"
          label="Cardholder name"
          autoComplete="cc-name"
          placeholder="Cardholder name"
          value={cardDetails.holderName}
          onChange={(event) => onCardHolderNameChange(event.target.value)}
          required
          disabled={paymentInputsLocked}
          aria-invalid={isMissingValue(cardDetails.holderName)}
          inputClassName={getInputClass(cardDetails.holderName)}
          labelClassName="block text-sm font-semibold text-primary-800 sm:col-span-2"
        />

        <CheckoutTextField
          id="cardNumber"
          name="cardNumber"
          label="Card number"
          autoComplete="cc-number"
          inputMode="numeric"
          maxLength={23}
          placeholder="1234 5678 9012 3456"
          value={cardDetails.number}
          onChange={(event) => onCardNumberChange(event.target.value)}
          required
          disabled={paymentInputsLocked}
          aria-invalid={isMissingValue(cardDetails.number)}
          inputClassName={getInputClass(cardDetails.number)}
          labelClassName="block text-sm font-semibold text-primary-800 sm:col-span-2"
        />

        <CheckoutTextField
          id="cardExpiry"
          name="cardExpiry"
          label="Expiry (MM/YY)"
          autoComplete="cc-exp"
          inputMode="numeric"
          maxLength={5}
          placeholder="MM/YY"
          value={cardDetails.expiry}
          onChange={(event) => onCardExpiryChange(event.target.value)}
          required
          disabled={paymentInputsLocked}
          aria-invalid={isMissingValue(cardDetails.expiry)}
          inputClassName={getInputClass(cardDetails.expiry)}
        />

        <CheckoutTextField
          id="cardCvv"
          name="cardCvv"
          label="Security code"
          autoComplete="cc-csc"
          inputMode="numeric"
          type="password"
          maxLength={4}
          placeholder="CVV"
          value={cardDetails.cvv}
          onChange={(event) => onCardCvvChange(event.target.value)}
          required
          disabled={paymentInputsLocked}
          aria-invalid={isMissingValue(cardDetails.cvv)}
          inputClassName={getInputClass(cardDetails.cvv)}
        />
      </div>
    );
  }

  if (selectedPaymentMethod === 'BANK_TRANSFER') {
    return (
      <div className="rounded-2xl border border-primary-300/70 bg-primary-100/72 p-4">
        <CheckoutTextField
          id="bankTransferReference"
          name="bankTransferReference"
          label="Transfer reference"
          value={bankTransferReference}
          onChange={(event) => onBankTransferReferenceChange(event.target.value)}
          required
          minLength={6}
          maxLength={18}
          placeholder="Example: GS-2041A"
          disabled={paymentInputsLocked}
          aria-invalid={isMissingValue(bankTransferReference)}
          inputClassName={getInputClass(bankTransferReference)}
        />
        <p className="mt-2 text-xs text-primary-600">
          After order creation, we provide beneficiary account details for this reference. Dispatch
          starts after funds settle.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-300/70 bg-primary-100/72 p-4">
      <CheckoutTextField
        id="walletEmail"
        name="walletEmail"
        label="Wallet email"
        autoComplete="email"
        type="email"
        placeholder="Wallet email"
        value={walletEmail}
        onChange={(event) => onWalletEmailChange(event.target.value)}
        required
        disabled={paymentInputsLocked}
        aria-invalid={isMissingValue(walletEmail)}
        inputClassName={getInputClass(walletEmail)}
      />
      <p className="mt-2 text-xs text-primary-600">
        You will be redirected to {selectedPaymentLabel} for final wallet authentication before
        capture.
      </p>
    </div>
  );
}
