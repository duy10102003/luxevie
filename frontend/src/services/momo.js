// frontend/src/services/momo.js
import api from './api';

/**
 * Tạo payment URL từ MoMo
 * @param {string} orderId - Order ID
 * @returns {Promise<{payUrl: string, orderId: string, orderCode: string}>}
 */
export async function createMoMoPayment(orderId) {
  const { data } = await api.post('/payments/momo/create', { orderId });
  return data;
}

/**
 * Kiểm tra trạng thái thanh toán MoMo
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>}
 */
export async function checkMoMoPaymentStatus(orderId) {
  const { data } = await api.get(`/payments/momo/status/${orderId}`);
  return data;
}

/**
 * Xác nhận thanh toán MoMo từ frontend (khi có resultCode=0)
 * @param {Object} params - Payment confirmation params
 * @param {string} params.orderId - Order ID
 * @param {number} params.resultCode - Result code from MoMo
 * @param {string} params.transId - Transaction ID
 * @param {number} params.amount - Amount
 * @param {string} params.orderCode - Order code
 * @returns {Promise<Object>}
 */
export async function confirmMoMoPayment({ orderId, resultCode, transId, amount, orderCode }) {
  const { data } = await api.post('/payments/momo/confirm', {
    orderId,
    resultCode,
    transId,
    amount,
    orderCode,
  });
  return data;
}

