/**
 * Public order confirmation page for guest checkout.
 */
import { Link, useParams } from "react-router-dom";
import { ORDER_STATUS_STYLES } from "../constants";
import { formatDate } from "../utils/formatDate";
import { readGuestOrder } from "../utils/guestOrderStorage";
import { formatCurrency } from "@/shared/utils/formatCurrency";

function GuestOrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const order = id ? readGuestOrder(id) : null;

  if (!order) {
    return (
      <section className="surface-card p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
          Guest checkout
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-primary-900">
          Order confirmation unavailable
        </h1>
        <p className="mt-2 text-sm text-primary-600">
          This guest order receipt is only stored on this device after checkout completes.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-full bg-primary-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-900"
        >
          Return to catalog
        </Link>
      </section>
    );
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemSubtotal = order.items.reduce(
    (sum, item) => sum + Number(item.priceAtPurchase) * item.quantity,
    0
  );

  return (
    <section className="space-y-5">
      <header className="surface-card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
              Guest checkout
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-primary-900 sm:text-3xl">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="mt-2 text-sm text-primary-600">Placed on {formatDate(order.createdAt)}</p>
          </div>

          <div className="w-full text-left sm:w-auto sm:text-right">
            <p
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${ORDER_STATUS_STYLES[order.status]}`}
            >
              {order.status}
            </p>
            <p className="mt-2 text-2xl font-bold text-primary-900">
              {formatCurrency(Number(order.total))}
            </p>
          </div>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <article className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-primary-900">Shipping address</h2>
            <div className="mt-3 space-y-1.5 text-sm text-primary-700">
              <p className="font-semibold text-primary-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </article>

          <article className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-primary-900">Order items</h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-start gap-3 rounded-2xl border border-primary-300/70 bg-primary-100/72 p-3 sm:items-center"
                >
                  <div className="product-image-frame h-14 w-14 rounded-xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        loading="lazy"
                        decoding="async"
                        className="product-image-zoom h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-600">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary-900">{item.product.title}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-500">
                      Qty {item.quantity} x {formatCurrency(Number(item.priceAtPurchase))}
                    </p>
                  </div>

                  <p className="w-full text-sm font-semibold text-primary-900 sm:w-auto sm:text-right">
                    {formatCurrency(Number(item.priceAtPurchase) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:col-span-5">
          <div className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-primary-900">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm text-primary-700">
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p>Items</p>
                <p className="font-semibold text-primary-900">
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p>Items subtotal</p>
                <p className="font-semibold text-primary-900">{formatCurrency(itemSubtotal)}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50/80 p-3">
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-primary-700">Total Paid</p>
                <p className="text-2xl font-bold text-primary-900">
                  {formatCurrency(Number(order.total))}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-primary-300/70 bg-primary-100/72 px-4 py-3 text-sm font-semibold text-primary-800 hover:border-accent-700 hover:text-primary-900"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default GuestOrderConfirmation;
