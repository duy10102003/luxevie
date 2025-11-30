// Script test đơn giản cho dashboard
import mongoose from 'mongoose';
import { Order } from '../src/models/Order.js';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';

// Kết nối database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test đơn giản
async function simpleTest() {
  try {
    console.log('🔍 Test đơn giản dashboard...\n');

    // Kiểm tra dữ liệu cơ bản
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    console.log('📊 Dữ liệu cơ bản:');
    console.log(`   - Tổng đơn hàng: ${totalOrders}`);
    console.log(`   - Tổng sản phẩm: ${totalProducts}`);
    console.log(`   - Tổng khách hàng: ${totalUsers}`);

    // Kiểm tra đơn hàng gần đây
    const recentOrders = await Order.find()
      .select('_id code total status createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    console.log('\n📦 Đơn hàng gần đây:');
    recentOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. #${order.code || order._id.slice(-6)} - ${order.status} - ${Number(order.total || 0).toLocaleString()}₫`);
    });

    // Kiểm tra doanh thu tháng này
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    console.log('\n💰 Doanh thu tháng này:');
    console.log(`   - Tổng: ${Number(monthlyRevenue[0]?.total || 0).toLocaleString()}₫`);

    console.log('\n✅ Test hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

// Chạy test
const main = async () => {
  await connectDB();
  await simpleTest();
  await mongoose.connection.close();
  console.log('👋 Đã đóng kết nối database');
  process.exit(0);
};

main().catch(console.error);
