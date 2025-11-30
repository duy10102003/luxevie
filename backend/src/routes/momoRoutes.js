// backend/src/routes/momoRoutes.js
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  createMoMoPayment,
  momoCallback,
  checkPaymentStatus,
  confirmMoMoPayment,
} from '../controllers/momoController.js';

const router = Router();

/**
 * POST /api/payments/momo/create
 * Tạo payment URL từ MoMo (yêu cầu đăng nhập)
 */
router.post('/payments/momo/create', authenticate, createMoMoPayment);

/**
 * POST /api/payments/momo/callback
 * Webhook callback từ MoMo (không cần auth)
 */
router.post('/payments/momo/callback', momoCallback);

/**
 * POST /api/payments/momo/confirm
 * Xác nhận thanh toán từ frontend (yêu cầu đăng nhập)
 */
router.post('/payments/momo/confirm', authenticate, confirmMoMoPayment);

/**
 * GET /api/payments/momo/status/:orderId
 * Kiểm tra trạng thái thanh toán (yêu cầu đăng nhập)
 */
router.get('/payments/momo/status/:orderId', authenticate, checkPaymentStatus);

export default router;

