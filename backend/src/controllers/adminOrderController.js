// backend/src/controllers/adminOrderController.js
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

function buildFilter(qs) {
  const { q, status, from, to, userId } = qs;
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.userId = userId;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (q) {
    const searchConditions = [
      { 'shippingAddress.fullName': new RegExp(q, 'i') },
      { 'shippingAddress.phone': new RegExp(q, 'i') },
      { 'shippingAddress.email': new RegExp(q, 'i') },
    ];

    // Tìm kiếm theo code (chỉ khi code tồn tại và không null)
    searchConditions.push({ 
      code: { $exists: true, $ne: null, $regex: q, $options: 'i' } 
    });

    // Tìm kiếm theo _id (ObjectId hoặc string)
    if (q.match(/^[0-9a-fA-F]{24}$/)) {
      // Nếu q là ObjectId hợp lệ
      searchConditions.push({ _id: q });
    } else if (q.length >= 6) {
      // Tìm kiếm theo phần cuối của _id (6 ký tự cuối)
      // Chuyển _id thành string để tìm kiếm
      searchConditions.push({ 
        $expr: { 
          $regexMatch: { 
            input: { $toString: "$_id" }, 
            regex: q.slice(-6) + '$', 
            options: 'i' 
          } 
        } 
      });
    }

    filter.$or = searchConditions;
  }
  return filter;
}

// Hàm lấy thống kê tổng (không áp dụng bộ lọc tìm kiếm)
async function getTotalStats() {
  const [totalStats, pendingStats] = await Promise.all([
    Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } }
    ]),
    Order.aggregate([
      { $match: { status: { $in: ['pending', 'confirmed'] } } },
      { $group: { _id: null, pendingCount: { $sum: 1 } } }
    ])
  ]);

  return {
    totalRevenue: totalStats?.[0]?.totalRevenue || 0,
    totalOrders: totalStats?.[0]?.count || 0,
    pendingOrders: pendingStats?.[0]?.pendingCount || 0
  };
}

export const adminListOrders = async (req, res) => {
  const { page = 1, limit = 1000, sort = 'latest', q, status, from, to, userId } = req.query;
  const filter = buildFilter({ q, status, from, to, userId });
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(1000, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const sortMap = {
    latest: { createdAt: -1 },
    amount_desc: { total: -1 },
    amount_asc: { total: 1 },
    status: { status: 1, createdAt: -1 },
  };

  // Lấy thống kê tổng (không áp dụng bộ lọc tìm kiếm)
  const totalStats = await getTotalStats();

  // Lấy dữ liệu đơn hàng với bộ lọc
  const [items, total] = await Promise.all([
    Order.find(filter)
      .select('_id code userId total status paid createdAt shippingAddress items')
      .populate('userId', 'name email')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip).limit(lim)
      .lean(),
    Order.countDocuments(filter)
  ]);

  res.json({
    items,
    pagination: { page: pg, limit: lim, total },
    stats: totalStats // Sử dụng thống kê tổng cố định
  });
};

export const adminGetOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate('userId', 'name email phone address avatarUrl dob gender status role createdAt')
    .populate('items.productId', 'name brand description images categories tags ratingAvg ratingCount status')
    .lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
};

export const adminUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, paid } = req.body;

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (status) {
    order.status = status;
    const now = new Date();
    if (status === 'confirmed' && !order.confirmedAt) order.confirmedAt = now;
    if (status === 'shipped' && !order.shippedAt) order.shippedAt = now;
    if (status === 'delivered' && !order.deliveredAt) order.deliveredAt = now;
    if (status === 'cancelled' && !order.cancelledAt) order.cancelledAt = now;
    if (status === 'refunded' && !order.refundedAt) order.refundedAt = now;
  }
  if (typeof paid === 'boolean') order.paid = paid;

  await order.save();
  res.json({ order });
};

// (tuỳ chọn) huỷ và refilling stock (nếu bạn có quản lý tồn kho)
export const adminCancelOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (['delivered','refunded','cancelled'].includes(order.status)) {
    return res.status(400).json({ message: 'Order not cancellable' });
  }

  // ví dụ: trả lại stock (chỉ minh hoạ — chỉnh theo schema Product/variants của bạn)
  for (const it of order.items) {
    await Product.updateOne(
      { _id: it.productId },
      { $inc: { stock: it.qty * 1 } }
    );
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  await order.save();
  res.json({ order });
};
