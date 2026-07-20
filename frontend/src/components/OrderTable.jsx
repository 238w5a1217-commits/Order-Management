import { Package, Settings, Truck, Check, X } from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters.js';
import LoadingState from './LoadingState.jsx';
import EmptyState from './EmptyState.jsx';
import Pagination from './Pagination.jsx';

const statusClass = (status) => {
  switch (status) {
    case 'PLACED': return 'status-placed';
    case 'PROCESSING': return 'status-processing';
    case 'READY_TO_SHIP': return 'status-ready';
    default: return 'status-badge bg-surface-200 text-surface-600';
  }
};

const statusLabel = (status) => {
  switch (status) {
    case 'PLACED': return <><Package className="w-3.5 h-3.5" /> Placed</>;
    case 'PROCESSING': return <><Settings className="w-3.5 h-3.5" /> Processing</>;
    case 'READY_TO_SHIP': return <><Truck className="w-3.5 h-3.5" /> Ready</>;
    default: return status;
  }
};

const OrderTable = ({ orders, loading, pagination, hasFilters, onPageChange }) => {
  if (loading && orders.length === 0) return <LoadingState />;
  if (!loading && orders.length === 0) return <EmptyState hasFilters={hasFilters} />;

  return (
    <div className="animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="table-header">Order ID</th>
              <th className="table-header">Customer</th>
              <th className="table-header">Phone</th>
              <th className="table-header">Product</th>
              <th className="table-header text-right">Amount</th>
              <th className="table-header">Status</th>
              <th className="table-header">Payment</th>
              <th className="table-header">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order._id}
                className={`border-b border-surface-200/50 hover:bg-surface-100/50 transition-colors duration-150 ${
                  loading ? 'opacity-60' : 'opacity-100'
                } animate-slide-up`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="table-cell">
                  <span className="font-mono text-xs text-brand-700 bg-brand-50 px-2 py-1 rounded">
                    {order.orderId}
                  </span>
                </td>
                <td className="table-cell font-medium text-surface-900">
                  {order.customerName}
                </td>
                <td className="table-cell text-surface-500 font-mono text-xs">
                  {order.phone}
                </td>
                <td className="table-cell max-w-[160px]">
                  <span className="truncate block" title={order.productName}>
                    {order.productName}
                  </span>
                </td>
                <td className="table-cell text-right font-semibold text-emerald-600">
                  {formatCurrency(order.amount)}
                </td>
                <td className="table-cell">
                  <span className={statusClass(order.status)}>
                    {statusLabel(order.status)}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={order.paymentStatus === 'PAID' ? 'payment-paid' : 'payment-unpaid'}>
                    {order.paymentStatus === 'PAID' ? <><Check className="w-3.5 h-3.5" /> Paid</> : <><X className="w-3.5 h-3.5" /> Unpaid</>}
                  </span>
                </td>
                <td className="table-cell">
                  <span title={formatDate(order.createdAt)} className="text-surface-500 cursor-default">
                    {formatRelativeTime(order.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default OrderTable;
