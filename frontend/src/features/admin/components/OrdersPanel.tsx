/**
 * Orders summary panel for admin operations.
 */
import { Link } from 'react-router-dom';
import { ORDER_STATUSES, ORDER_STATUS_STYLES } from '../constants';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/features/orders/utils/formatDate';
import type { Order } from '@/shared/types';
import type { AdminOrder, OrderStatus } from '../types';

type OrdersPanelOrder = Order & {
  user?: AdminOrder['user'];
};

// Props required to render the admin orders panel.
interface OrdersPanelProps {
  orders: OrdersPanelOrder[];
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  title?: string;
  description?: string;
  highlightOrderId?: string;
  emptyMessage?: string;
}

// Renders a summary list of recent orders with status updates.
export function OrdersPanel({
  orders,
  onUpdateStatus,
  title = 'Recent Orders',
  description,
  highlightOrderId,
  emptyMessage = 'No orders to display yet.',
}: OrdersPanelProps) {
  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-primary-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-primary-600">{description}</p>}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-primary-300/70 bg-primary-100/70 p-4 text-sm text-primary-600">
            {emptyMessage}
          </div>
        ) : (
          orders.slice(0, 10).map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const isHighlighted = order.id === highlightOrderId;

            return (
              <article
                key={order.id}
                className={`rounded-2xl border p-3 transition-colors ${
                  isHighlighted
                    ? 'border-accent-700/55 bg-accent-700/10'
                    : 'border-primary-300/70 bg-primary-100/70'
                }`}
              >
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary-900">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-primary-600">
                      {order.user?.email ?? formatDate(order.createdAt)} |{' '}
                      {formatCurrency(Number(order.total))}
                    </p>
                    {!order.user && (
                      <p className="mt-1 text-xs text-primary-500">
                        {itemCount} item{itemCount === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        ORDER_STATUS_STYLES[order.status as OrderStatus]
                      }`}
                    >
                      {order.status}
                    </span>
                    {onUpdateStatus ? (
                      <select
                        value={order.status}
                        onChange={(event) =>
                          onUpdateStatus(order.id, event.target.value as OrderStatus)
                        }
                        className="w-full rounded-lg border border-primary-300/70 bg-primary-100/75 px-2 py-2 text-xs font-semibold text-primary-900 sm:w-auto"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Link
                        to={`/orders/${order.id}`}
                        className="w-full rounded-lg border border-primary-300/70 bg-primary-100/75 px-3 py-2 text-center text-xs font-semibold text-primary-900 hover:border-accent-700 sm:w-auto"
                      >
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

