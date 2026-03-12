/**
 * Checkout page composed from smaller feature-local sections and state hooks.
 */
import { getApiErrorMessage } from '@/shared/api/error';
import { useCartData } from '@/features/cart/hooks/useCartData';
import { CheckoutLoading } from '../components/CheckoutLoading';
import { CheckoutHeader } from '../components/sections/CheckoutHeader';
import { PaymentSection } from '../components/sections/PaymentSection';
import { ShippingAddressSection } from '../components/sections/ShippingAddressSection';
import { CheckoutEmptyState } from '../components/states/CheckoutEmptyState';
import { CheckoutErrorState } from '../components/states/CheckoutErrorState';
import { OrderItemsCard } from '../components/summary/OrderItemsCard';
import { OrderSummaryCard } from '../components/summary/OrderSummaryCard';
import { useCheckoutFlow } from '../hooks/useCheckoutFlow';

// Orchestrates data loading and composes the checkout UI sections.
function Checkout() {
  const { authed, cart, isLoading, isError, error, refetch } = useCartData();
  const items = cart?.items ?? [];
  const checkout = useCheckoutFlow({ authed, items });

  if (authed && isLoading) {
    return <CheckoutLoading />;
  }

  if (authed && isError) {
    return (
      <CheckoutErrorState
        message={getApiErrorMessage(error, 'Failed to load cart for checkout')}
        onRetry={() => refetch()}
      />
    );
  }

  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <section className="space-y-5">
      <CheckoutHeader isShippingComplete={checkout.isShippingComplete} />

      <div className="grid items-start gap-5 lg:grid-cols-12">
        <form
          onSubmit={checkout.handleSubmit}
          noValidate
          className="surface-card p-5 sm:p-6 lg:col-span-8"
        >
          <ShippingAddressSection
            form={checkout.form}
            getInputClass={checkout.getInputClass}
            isMissingValue={checkout.isMissingValue}
            onFieldChange={checkout.updateShippingField}
          />

          <PaymentSection
            selectedPaymentMethod={checkout.selectedPaymentMethod}
            selectedPaymentLabel={checkout.selectedPaymentOption.label}
            cardDetails={checkout.cardDetails}
            walletEmail={checkout.walletEmail}
            bankTransferReference={checkout.bankTransferReference}
            errorMessage={checkout.errorMessage}
            paymentPreview={checkout.paymentPreview}
            totalEstimate={checkout.totals.totalEstimate}
            isShippingComplete={checkout.isShippingComplete}
            paymentInputsLocked={checkout.paymentInputsLocked}
            hasAuthorizedPayment={checkout.hasAuthorizedPayment}
            hasAcceptedPolicies={checkout.hasAcceptedPolicies}
            isSubmitting={checkout.isSubmitting}
            isMissingValue={checkout.isMissingValue}
            getInputClass={checkout.getInputClass}
            onSelectPaymentMethod={checkout.updateSelectedPaymentMethod}
            onCardHolderNameChange={checkout.updateCardHolderName}
            onCardNumberChange={checkout.updateCardNumber}
            onCardExpiryChange={checkout.updateCardExpiry}
            onCardCvvChange={checkout.updateCardCvv}
            onWalletEmailChange={checkout.updateWalletEmail}
            onBankTransferReferenceChange={checkout.updateBankTransferReference}
            onAuthorizedChange={checkout.updateAuthorizedPayment}
            onAcceptedPoliciesChange={checkout.updateAcceptedPolicies}
            onOpenTerms={checkout.openTermsOfServiceMessage}
            onOpenPrivacy={checkout.openPrivacyPolicyMessage}
          />
        </form>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:col-span-4">
          <OrderSummaryCard totals={checkout.totals} />
          <OrderItemsCard items={items} />
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
