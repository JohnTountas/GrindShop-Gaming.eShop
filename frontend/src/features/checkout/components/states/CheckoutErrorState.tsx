/**
 * Error state shown when the authenticated cart cannot be loaded.
 */
interface CheckoutErrorStateProps {
  message: string;
  onRetry: () => void;
}

// Keeps the retry UX separate from the main checkout composition.
export function CheckoutErrorState({ message, onRetry }: CheckoutErrorStateProps) {
  return (
    <div role="alert" className="surface-card border-red-200 bg-red-50 p-5 text-red-800">
      <p className="font-semibold">Unable to prepare checkout</p>
      <p className="mt-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
      >
        Retry
      </button>
    </div>
  );
}
