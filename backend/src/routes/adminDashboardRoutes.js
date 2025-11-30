// backend/src/routes/adminDashboardRoutes.js
import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.js';
import { 
  getDashboardStats, 
  getRevenueChart, 
  getRecentOrders, 
  getTopProducts 
} from '../controllers/adminDashboardController.js';

const router = Router();

// Tất cả routes đều yêu cầu admin
router.use(requireAdmin);

// GET /admin/dashboard/stats - Lấy thống kê tổng quan
router.get('/stats', getDashboardStats);

// GET /admin/dashboard/revenue-chart - Lấy dữ liệu biểu đồ doanh thu
router.get('/revenue-chart', getRevenueChart);

// GET /admin/dashboard/recent-orders - Lấy đơn hàng gần đây
router.get('/recent-orders', getRecentOrders);

// GET /admin/dashboard/top-products - Lấy sản phẩm bán chạy
router.get('/top-products', getTopProducts);

export default router;
