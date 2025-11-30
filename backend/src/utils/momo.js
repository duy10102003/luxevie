// backend/src/utils/momo.js
// Utility functions for MoMo Payment Gateway integration

import crypto from 'crypto';
import axios from 'axios';

// MoMo API configuration
const MOMO_CONFIG = {
  // Sandbox environment (for testing)
  // Production: https://payment.momo.vn/v2/gateway/api/create
  // Sandbox: https://test-payment.momo.vn/v2/gateway/api/create
  API_URL: process.env.MOMO_API_URL || 'https://test-payment.momo.vn/v2/gateway/api/create',
  PARTNER_CODE: process.env.MOMO_PARTNER_CODE || '',
  ACCESS_KEY: process.env.MOMO_ACCESS_KEY || '',
  SECRET_KEY: process.env.MOMO_SECRET_KEY || '',
  ENVIRONMENT: process.env.MOMO_ENVIRONMENT || 'sandbox', // sandbox | production
};

/**
 * Tạo chữ ký (signature) cho request MoMo
 */
export function createSignature(data) {
  const {
    accessKey,
    amount,
    extraData,
    ipnUrl,
    orderId,
    orderInfo,
    partnerCode,
    redirectUrl,
    requestId,
    requestType = 'payWithATM',
  } = data;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData || ''}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  return crypto
    .createHmac('sha256', MOMO_CONFIG.SECRET_KEY)
    .update(rawSignature)
    .digest('hex');
}

/**
 * Xác thực chữ ký từ callback MoMo
 */
export function verifySignature(data, signature) {
  const {
    accessKey,
    amount,
    extraData,
    message,
    orderId,
    orderInfo,
    orderType,
    partnerCode,
    payType,
    requestId,
    responseTime,
    resultCode,
    transId,
  } = data;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData || ''}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  
  const expectedSignature = crypto
    .createHmac('sha256', MOMO_CONFIG.SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Tạo payment URL từ MoMo
 * @param {Object} params - Payment parameters
 * @param {string} params.orderId - Order ID
 * @param {number} params.amount - Amount (VND)
 * @param {string} params.orderInfo - Order description
 * @param {string} params.returnUrl - URL redirect sau khi thanh toán
 * @param {string} params.notifyUrl - URL callback từ MoMo
 * @param {string} params.extraData - Extra data (optional)
 * @returns {Promise<Object>} Payment response with payUrl
 */
export async function createPaymentUrl({
  orderId,
  amount,
  orderInfo,
  returnUrl,
  notifyUrl,
  extraData = '',
}) {
  if (!MOMO_CONFIG.PARTNER_CODE || !MOMO_CONFIG.ACCESS_KEY || !MOMO_CONFIG.SECRET_KEY) {
    throw new Error('MoMo configuration is missing. Please set MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, and MOMO_SECRET_KEY in .env');
  }

  const requestId = `${MOMO_CONFIG.PARTNER_CODE}${Date.now()}`;
  const requestType = process.env.MOMO_REQUEST_TYPE || 'payWithATM';

  const requestData = {
    accessKey: MOMO_CONFIG.ACCESS_KEY,
    amount,
    extraData,
    ipnUrl: notifyUrl,
    orderId,
    orderInfo,
    partnerCode: MOMO_CONFIG.PARTNER_CODE,
    redirectUrl: returnUrl,
    requestId,
    requestType,
  };

  // Tạo signature
  const signature = createSignature(requestData);
  requestData.signature = signature;

  try {
    const response = await axios.post(MOMO_CONFIG.API_URL, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.resultCode === 0) {
      return {
        success: true,
        payUrl: response.data.payUrl,
        requestId: response.data.requestId,
        orderId: response.data.orderId,
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Payment creation failed',
        resultCode: response.data.resultCode,
      };
    }
  } catch (error) {
    console.error('MoMo payment error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create MoMo payment');
  }
}

/**
 * Kiểm tra trạng thái thanh toán từ MoMo
 */
export async function queryPaymentStatus(orderId, requestId) {
  if (!MOMO_CONFIG.PARTNER_CODE || !MOMO_CONFIG.ACCESS_KEY || !MOMO_CONFIG.SECRET_KEY) {
    throw new Error('MoMo configuration is missing');
  }

  const rawSignature = `accessKey=${MOMO_CONFIG.ACCESS_KEY}&orderId=${orderId}&partnerCode=${MOMO_CONFIG.PARTNER_CODE}&requestId=${requestId}`;
  const signature = crypto
    .createHmac('sha256', MOMO_CONFIG.SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  const requestData = {
    partnerCode: MOMO_CONFIG.PARTNER_CODE,
    accessKey: MOMO_CONFIG.ACCESS_KEY,
    requestId,
    orderId,
    signature,
    lang: 'vi',
  };

  try {
    const queryUrl = MOMO_CONFIG.API_URL.replace('/create', '/query');
    const response = await axios.post(queryUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('MoMo query error:', error);
    throw new Error('Failed to query payment status');
  }
}

export { MOMO_CONFIG };

