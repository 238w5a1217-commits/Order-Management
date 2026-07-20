import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOrders } from '../api/ordersApi.js';

const AUTO_REFRESH_INTERVAL = 5000;

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [statusCounts, setStatusCounts] = useState({ PLACED: 0, PROCESSING: 0, READY_TO_SHIP: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const intervalRef = useRef(null);

  const loadOrders = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) params[k] = v;
      });
      const response = await fetchOrders(params);
      setOrders(response.data);
      setPagination(response.pagination);
      if (response.statusCounts) {
        setStatusCounts(response.statusCounts);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(filters);
  }, [filters, loadOrders]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      loadOrders(filters);
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [filters, loadOrders]);

  const refresh = useCallback(() => {
    loadOrders(filters);
  }, [filters, loadOrders]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const setPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
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
  };
};

export default useOrders;
