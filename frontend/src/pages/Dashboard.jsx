import { useState, useCallback } from 'react';
import { RefreshCw, X } from 'lucide-react';
import useOrders from '../hooks/useOrders.js';
import SearchBar from '../components/SearchBar.jsx';
import StatusFilter from '../components/StatusFilter.jsx';
import OrderTable from '../components/OrderTable.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { formatRelativeTime } from '../utils/formatters.js';

const STATUS_COUNTS_LABELS = [
  { status: 'PLACED', label: 'Placed', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  { status: 'PROCESSING', label: 'Processing', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  { status: 'READY_TO_SHIP', label: 'Ready to Ship', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
];

const Dashboard = () => {
  const {
    orders,
    pagination,
    statusCounts,
    loading,
    error,
    filters,
    lastRefreshed,
    refresh,
    updateFilters,
    setPage,
  } = useOrders();

  const [searchInput, setSearchInput] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
    clearTimeout(searchTimeout);
    const t = setTimeout(() => updateFilters({ search: value }), 400);
    setSearchTimeout(t);
  }, [searchTimeout, updateFilters]);

  const countsLabels = STATUS_COUNTS_LABELS.map(({ status, label, color, bg }) => ({
    label,
    color,
    bg,
    count: statusCounts[status] || 0,
  }));

  const hasFilters = !!(filters.status || filters.paymentStatus || filters.search);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Orders Dashboard</h1>
          <p className="text-surface-500 text-sm mt-1">
            {pagination.total} total order{pagination.total !== 1 ? 's' : ''} · Auto-refresh every 30s
            {lastRefreshed && (
              <span className="ml-2 text-surface-400">
                · Last updated {formatRelativeTime(lastRefreshed)}
              </span>
            )}
          </p>
        </div>
        <button
          id="refresh-btn"
          onClick={refresh}
          disabled={loading}
          className="btn-secondary self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 col-span-2 sm:col-span-1 border-surface-200">
          <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-surface-900 mt-1">{pagination.total}</p>
        </div>
        {countsLabels.map(({ label, color, bg, count }) => (
          <div key={label} className={`glass-card p-4 border ${bg}`}>
            <p className="text-xs text-surface-600 uppercase tracking-wider font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={searchInput} onChange={handleSearchChange} />
          </div>
          <StatusFilter
            status={filters.status}
            paymentStatus={filters.paymentStatus}
            onStatusChange={(v) => updateFilters({ status: v })}
            onPaymentChange={(v) => updateFilters({ paymentStatus: v })}
          />
          {hasFilters && (
            <button
              id="clear-filters-btn"
              onClick={() => {
                setSearchInput('');
                updateFilters({ status: '', paymentStatus: '', search: '' });
              }}
              className="btn-ghost whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <OrderTable
            orders={orders}
            loading={loading}
            pagination={pagination}
            hasFilters={hasFilters}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
