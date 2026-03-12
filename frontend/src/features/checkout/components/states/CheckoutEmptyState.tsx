/**
 * Empty-cart state shown when checkout has no items to process.
 */
import { Link } from 'react-router-dom';

// Guides the user back to shopping when checkout has no cart lines.
export function CheckoutEmptyState() {
  return (
    <section className="surface-card p-8 text-center">
      <h1 className="text-2xl font-semibold text-primary-900">Your cart is empty</h1>
      <p className="mt-2 text-sm text-primary-600">
        Add products before checking out. Your shipping form will appear once items are in cart.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          to="/"
          className="rounded-full bg-primary-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-900"
        >
          Browse catalog
        </Link>
        <Link
          to="/cart"
          className="rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary-800 hover:border-primary-400 hover:text-primary-900"
        >
          Back to cart
        </Link>
      </div>
    </section>
  );
}
