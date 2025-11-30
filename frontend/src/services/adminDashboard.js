// frontend/src/services/adminDashboard.js
import api from './api';

export async function getDashboardStats() {
  const { data } = await api.get('/admin/dashboard/stats');
  return data;
}

export async function getRevenueChart() {
  const { data } = await api.get('/admin/dashboard/revenue-chart');
  return data;
}

export async function getRecentOrders() {
  const { data } = await api.get('/admin/dashboard/recent-orders');
  return data;
}

export async function getTopProducts() {
  const { data } = await api.get('/admin/dashboard/top-products');
  return data;
}
