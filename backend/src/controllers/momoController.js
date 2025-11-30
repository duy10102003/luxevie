// backend/src/controllers/momoController.js
import { Order } from '../models/Order.js';
import { createPaymentUrl, verifySignature, queryPaymentStatus } from '../utils/momo.js';

/**
 * POST /api/payments/momo/create
 * Tạo payment URL từ MoMo
 */
export const createMoMoPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'orderId is required',
      });
    }

    // Tìm order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Order not found',
      });
    }

    // Kiểm tra order đã được thanh toán chưa
    if (order.paid) {
      return res.status(400).json({
        code: 'ALREADY_PAID',
        message: 'Order already paid',
      });
    }

    // Kiểm tra payment method
    if (order.paymentMethod !== 'momo') {
      return res.status(400).json({
        code: 'INVALID_PAYMENT_METHOD',
        message: 'Order payment method is not MoMo',
      });
    }

    // Tạo payment URL
    const baseUrl = process.env.APP_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    const apiBaseUrl = process.env.API_BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000';
    const returnUrl = `${baseUrl}/order-success?orderId=${order._id}`;
    const notifyUrl = `${apiBaseUrl}/api/payments/momo/callback`;

    const paymentResult = await createPaymentUrl({
      orderId: order.code, // Sử dụng order code làm orderId cho MoMo
      amount: Math.round(order.total), // MoMo yêu cầu số nguyên (VND)
      orderInfo: `Thanh toan don hang ${order.code}`,
      returnUrl,
      notifyUrl,
      extraData: JSON.stringify({ orderId: order._id.toString() }),
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        code: 'PAYMENT_CREATION_FAILED',
        message: paymentResult.message || 'Failed to create payment',
      });
    }

    // Lưu requestId vào order (nếu cần)
    order.momoRequestId = paymentResult.requestId;
    await order.save();

    res.json({
      payUrl: paymentResult.payUrl,
      orderId: order._id,
      orderCode: order.code,
    });
  } catch (error) {
    console.error('Create MoMo payment error:', error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create payment',
    });
  }
};

/**
 * POST /api/payments/momo/callback
 * Webhook callback từ MoMo sau khi thanh toán
 */
export const momoCallback = async (req, res) => {
  try {
    console.log('📥 MoMo callback received:', JSON.stringify(req.body, null, 2));
    
    const {
      partnerCode,
      orderId, // order code
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    // Xác thực signature
    const isValid = verifySignature(
      {
        accessKey: process.env.MOMO_ACCESS_KEY || '',
        amount,
        extraData: extraData || '',
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
      },
      signature
    );

    if (!isValid) {
      console.error('❌ Invalid MoMo signature. OrderId:', orderId);
      console.error('Expected signature data:', {
        accessKey: process.env.MOMO_ACCESS_KEY ? '***' : 'MISSING',
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
      });
      return res.status(400).json({
        code: 'INVALID_SIGNATURE',
        message: 'Invalid signature',
      });
    }

    // Tìm order bằng code
    const order = await Order.findOne({ code: orderId });
    if (!order) {
      console.error('❌ Order not found with code:', orderId);
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Order not found',
      });
    }
    
    console.log(`📦 Found order: ${order.code} (${order._id}), current status: ${order.status}, paid: ${order.paid}`);

    // Xử lý kết quả thanh toán
    if (resultCode === 0) {
      // Thanh toán thành công
      order.paid = true;
      order.status = 'confirmed'; // Cập nhật status thành confirmed
      order.momoTransId = transId;
      order.momoResponseTime = new Date(responseTime);
      order.confirmedAt = new Date();
      
      // Lưu thông tin payment vào order
      if (!order.paymentInfo) {
        order.paymentInfo = {};
      }
      order.paymentInfo.momo = {
        transId,
        payType,
        responseTime,
        amount,
      };

      await order.save();

      console.log(`✅ Order ${order.code} (${order._id}) paid successfully via MoMo. TransId: ${transId}, Status: ${order.status}, Paid: ${order.paid}`);
    } else {
      // Thanh toán thất bại
      console.error(`❌ MoMo payment failed for order ${order.code}. ResultCode: ${resultCode}, Message: ${message}`);
      
      // Có thể cập nhật order status hoặc giữ nguyên pending
      // order.status = 'cancelled';
      // await order.save();
    }

    // Trả về response cho MoMo
    res.json({
      resultCode: 0,
      message: 'Success',
    });
  } catch (error) {
    console.error('MoMo callback error:', error);
    res.status(500).json({
      resultCode: -1,
      message: 'Internal error',
    });
  }
};

/**
 * POST /api/payments/momo/confirm
 * Xác nhận thanh toán từ frontend khi có resultCode=0 (callback có thể chưa kịp xử lý)
 */
export const confirmMoMoPayment = async (req, res) => {
  try {
    const { orderId, resultCode, transId, amount, orderCode } = req.body;

    if (!orderId) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'orderId is required',
      });
    }

    // Chỉ xử lý khi resultCode = 0 (thanh toán thành công)
    if (resultCode !== 0) {
      return res.json({
        success: false,
        message: 'Payment not successful',
      });
    }

    // Tìm order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Order not found',
      });
    }

    // Nếu đã thanh toán rồi, không cần cập nhật
    if (order.paid) {
      return res.json({
        success: true,
        message: 'Order already paid',
        order,
      });
    }

    // Cập nhật order
    order.paid = true;
    if (transId) order.momoTransId = transId;
    if (!order.confirmedAt) order.confirmedAt = new Date();

    if (!order.paymentInfo) {
      order.paymentInfo = {};
    }
    order.paymentInfo.momo = {
      transId: transId || order.momoTransId,
      amount: amount || order.total,
      confirmedAt: new Date(),
    };

    await order.save();

    console.log(`✅ Order ${order.code} (${order._id}) confirmed payment via frontend. TransId: ${transId}`);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Confirm MoMo payment error:', error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to confirm payment',
    });
  }
};

/**
 * GET /api/payments/momo/status/:orderId
 * Kiểm tra trạng thái thanh toán
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Order not found',
      });
    }

    if (!order.momoRequestId) {
      return res.status(400).json({
        code: 'NO_PAYMENT_REQUEST',
        message: 'No payment request found for this order',
      });
    }

    // Query status từ MoMo
    const statusResult = await queryPaymentStatus(order.code, order.momoRequestId);

    res.json({
      orderId: order._id,
      orderCode: order.code,
      paid: order.paid,
      status: order.status,
      momoStatus: statusResult,
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to check payment status',
    });
  }
};
