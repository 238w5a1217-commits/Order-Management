import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const fetchOrders = (params = {}) =>
  api.get('/orders', { params });

export const fetchOrderById = (id) =>
  api.get(`/orders/${id}`);

export const createOrder = (data) =>
  api.post('/orders', data);

export const updateOrder = (id, data) =>
  api.put(`/orders/${id}`, data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`);

export const triggerScheduler = (secretKey) =>
  api.post('/scheduler/run', {}, {
    headers: { 'x-secret-key': secretKey },
  });

export const fetchSchedulerLogs = (params = {}, secretKey) =>
  api.get('/scheduler/logs', {
    params,
    headers: { 'x-secret-key': secretKey },
  });
