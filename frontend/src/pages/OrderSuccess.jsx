import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/orders';
import { checkMoMoPaymentStatus, confirmMoMoPayment } from '../services/momo';

function StatusBadge({ status }) {
  const statusConfig = {
    pending: { text: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700 border-amber-200' },
    confirmed: { text: 'Đã xác nhận', class: 'bg-sky-100 text-sky-700 border-sky-200' },
    processing: { text: 'Đang xử lý', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    shipped: { text: 'Đang giao', class: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    delivered: { text: 'Đã giao', class: 'bg-green-100 text-green-700 border-green-200' },
    completed: { text: 'Hoàn tất', class: 'bg-green-100 text-green-700 border-green-200' },
    cancelled: { text: 'Đã hủy', class: 'bg-red-100 text-red-700 border-red-200' },
    refunded: { text: 'Đã hoàn tiền', class: 'bg-gray-100 text-gray-700 border-gray-200' },
  };
  const config = statusConfig[status] || { text: status, class: 'bg-gray-100 text-gray-700 border-gray-200' };

  return (
    <span className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${config.class}`}>
      {config.text}
    </span>
  );
}

export default function OrderSuccess() {
  const loc = useLocation();
  const qs = new URLSearchParams(loc.search);

  // Lấy orderId từ nhiều nguồn: ưu tiên extraData (MoMo callback), sau đó id, cuối cùng orderId
  let id = qs.get('id');
  const code = qs.get('code') || '';

  // Ưu tiên parse từ extraData (MoMo callback) vì nó chứa MongoDB ID chính xác
  const extraData = qs.get('extraData');
  if (extraData) {
    try {
      const parsed = JSON.parse(decodeURIComponent(extraData));
      if (parsed.orderId) {
        id = parsed.orderId;
      }
    } catch (e) {
      console.error('Error parsing extraData:', e);
    }
  }

  // Nếu chưa có id, thử lấy từ orderId (nhưng có thể là order code, không phải MongoDB ID)
  if (!id) {
    id = qs.get('orderId');
  }

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id) {
        setLoading(true);
        try {
          const orderData = await fetchOrderById(id);
          setOrder(orderData);

          // Kiểm tra nếu có resultCode từ MoMo redirect (thanh toán thành công)
          const resultCode = qs.get('resultCode');
          const transId = qs.get('transId');
          const amount = qs.get('amount');
          const orderCode = qs.get('orderId'); // Order code từ MoMo
          const isMoMoSuccess = resultCode === '0';

          // Nếu có resultCode=0 (thanh toán thành công) và order chưa được đánh dấu đã thanh toán
          if (orderData && orderData.paymentMethod === 'momo' && isMoMoSuccess && !orderData.paid) {
            try {
              console.log('💰 Confirming MoMo payment from frontend...');
              // Xác nhận thanh toán từ frontend (callback có thể chưa kịp xử lý)
              const confirmResult = await confirmMoMoPayment({
                orderId: id,
                resultCode: parseInt(resultCode),
                transId,
                amount: amount ? parseInt(amount) : orderData.total,
                orderCode,
              });

              if (confirmResult.success && confirmResult.order) {
                setOrder(confirmResult.order);
                console.log('✅ Payment confirmed successfully');
              }
            } catch (confirmError) {
              console.error('Error confirming MoMo payment:', confirmError);
              // Nếu confirm thất bại, thử check status
              try {
                const statusResult = await checkMoMoPaymentStatus(id);
                if (statusResult.paid) {
                  const updatedOrder = await fetchOrderById(id);
                  setOrder(updatedOrder);
                }
              } catch (statusError) {
                console.error('Error checking MoMo payment status:', statusError);
              }
            }
          } else if (orderData && orderData.paymentMethod === 'momo' && !orderData.paid && !isMoMoSuccess) {
            // Nếu chưa thanh toán và không có resultCode=0, kiểm tra trạng thái
            try {
              const statusResult = await checkMoMoPaymentStatus(id);
              if (statusResult.paid) {
                const updatedOrder = await fetchOrderById(id);
                setOrder(updatedOrder);
              }
            } catch (statusError) {
              console.error('Error checking MoMo payment status:', statusError);
            }
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          // Nếu lỗi, vẫn dừng loading để hiển thị error message
        } finally {
          setLoading(false);
        }
      } else {
        // Nếu không có id, dừng loading
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 mb-6">Đơn hàng này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link to="/orders" className="btn-primary">Quay lại danh sách đơn hàng</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Đơn hàng #{order?.code || code || order?._id?.slice(-8) || '—'}
          </h1>
          <p className="text-sm text-gray-600">
            Đặt lúc: {order?.placedAt ? new Date(order.placedAt).toLocaleString('vi-VN') :
              order?.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '—'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={order?.status || 'pending'} />
          {order?.paid && (
            <span className="px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-semibold">
              ✓ Đã thanh toán
            </span>
          )}
        </div>
      </div>

      {/* Success Message (only show if status is pending/confirmed) */}
      {order && ['pending', 'confirmed'].includes(order.status) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Đặt hàng thành công!</h3>
              <p className="text-sm text-green-700">
                Chúng tôi sẽ liên hệ để xác nhận trong thời gian sớm nhất.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          {order && order.items && order.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Sản phẩm đã đặt</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.items.length} sản phẩm trong đơn hàng của bạn
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {order.items.map((item, idx) => {
                    const unitPrice = Number(item.price || 0);
                    const quantity = Number(item.qty || 0);
                    const lineTotal = unitPrice * quantity;

                    return (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                              {item.productId?.images?.[0]?.url ? (
                                <img
                                  src={item.productId.images[0].url}
                                  alt={item.productId.images[0].alt || item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-2xl">📦</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0 flex flex-col gap-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                  {item.name}
                                </h3>
                                {item.productId?.brand && (
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    Thương hiệu: <span className="font-medium text-gray-700">{item.productId.brand}</span>
                                  </p>
                                )}
                              </div>

                              {/* Line total (desktop) */}
                              <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                  Thành tiền
                                </span>
                                <span className="text-lg font-semibold text-gray-900">
                                  {lineTotal.toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                            </div>

                            {/* Variants */}
                            <div className="flex flex-wrap gap-2">
                              {item.size && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                                    S
                                  </span>
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                                  <span className="w-4 h-4 rounded-full bg-green-500" />
                                  Màu: {item.color}
                                </span>
                              )}
                              {item.sku && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-[11px] font-mono">
                                  SKU: {item.sku}
                                </span>
                              )}
                            </div>

                            {/* Quantity & price */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-dashed border-gray-200 mt-2">
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
                                  <span className="w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-semibold">
                                    {quantity}
                                  </span>
                                  <span>Số lượng</span>
                                </span>
                                <span className="text-gray-500">
                                  Đơn giá:{' '}
                                  <span className="font-semibold text-gray-900">
                                    {unitPrice.toLocaleString('vi-VN')}₫
                                  </span>
                                </span>
                              </div>

                              {/* Line total (mobile) */}
                              <div className="flex sm:hidden justify-between items-center text-sm">
                                <span className="text-gray-600">Thành tiền</span>
                                <span className="text-base font-semibold text-gray-900">
                                  {lineTotal.toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Shipping Address */}
          {order?.shippingAddress && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h2>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">{order.shippingAddress.fullName || '—'}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone || '—'}</p>
                  {order.shippingAddress.email && (
                    <p className="text-gray-600">{order.shippingAddress.email}</p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-gray-700">
                      {order.shippingAddress.line1 || ''}
                      {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                    </p>
                    <p className="text-gray-700">
                      {[
                        order.shippingAddress.ward,
                        order.shippingAddress.district,
                        order.shippingAddress.city
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tổng kết đơn hàng</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="text-gray-900">{Number(order?.subtotal || 0).toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="text-gray-900">{Number(order?.shippingFee || 0).toLocaleString('vi-VN')}₫</span>
                </div>
                {order?.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="text-red-600">-{Number(order.discount).toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Tổng thanh toán</span>
                    <span className="text-lg font-bold text-gray-900">{Number(order?.total || 0).toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h2>
            </div>
            <div className="p-6">
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">
                  {order?.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
                    order?.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' :
                      order?.paymentMethod === 'momo' ? 'Ví điện tử MoMo' :
                        order?.paymentMethod === 'vnpay' ? 'VNPay' :
                          order?.paymentMethod === 'qr' ? 'Thanh toán quét mã QR' :
                            order?.paymentMethod === 'paypal' ? 'Thanh toán bằng PayPal' :
                              order?.paymentMethod || 'COD'}
                </p>
                {order?.paid && (
                  <p className="text-green-600 font-medium mt-2">✓ Đã thanh toán</p>
                )}
              </div>
            </div>
          </div>

          {/* Note */}
          {order?.note && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Ghi chú</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 whitespace-pre-line">{order.note}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/collection"
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center font-medium"
        >
          Tiếp tục mua sắm
        </Link>
        <Link
          to="/orders"
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
        >
          Xem tất cả đơn hàng
        </Link>
      </div>
    </div>
  );
}
