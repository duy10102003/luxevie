// Script test API dashboard
import mongoose from 'mongoose';
import { Order } from '../src/models/Order.js';
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

// Test dashboard API
async function testDashboardAPI() {
  try {
    console.log('🔍 Test Dashboard API...\n');

    // Import controller để test
    const { 
      getDashboardStats, 
      getRevenueChart, 
      getRecentOrders, 
      getTopProducts 
    } = await import('../src/controllers/adminDashboardController.js');

    // Test getDashboardStats
    console.log('📊 Test getDashboardStats:');
    let result = null;
    const mockRes1 = { json: (data) => { result = data; } };
    await getDashboardStats({}, mockRes1);
    console.log('   ✅ Thành công');
    console.log(`   - Tổng đơn hàng: ${result.overview?.totalOrders || 0}`);
    console.log(`   - Tổng sản phẩm: ${result.overview?.totalProducts || 0}`);
    console.log(`   - Tổng khách hàng: ${result.overview?.totalUsers || 0}`);
    console.log(`   - Doanh thu tháng: ${Number(result.monthly?.revenue || 0).toLocaleString()}₫`);
    console.log(`   - Tăng trưởng đơn hàng: ${result.monthly?.orderGrowthRate || 0}%`);
    console.log('');

    // Test getRevenueChart
    console.log('📈 Test getRevenueChart:');
    result = null;
    const mockRes2 = { json: (data) => { result = data; } };
    await getRevenueChart({}, mockRes2);
    console.log('   ✅ Thành công');
    console.log(`   - Số ngày dữ liệu: ${result.chartData?.length || 0}`);
    if (result.chartData?.length > 0) {
      console.log(`   - Ngày đầu: ${result.chartData[0].date}`);
      console.log(`   - Ngày cuối: ${result.chartData[result.chartData.length - 1].date}`);
    }
    console.log('');

    // Test getRecentOrders
    console.log('📦 Test getRecentOrders:');
    result = null;
    const mockRes3 = { json: (data) => { result = data; } };
    await getRecentOrders({}, mockRes3);
    console.log('   ✅ Thành công');
    console.log(`   - Số đơn hàng gần đây: ${result.orders?.length || 0}`);
    if (result.orders?.length > 0) {
      console.log(`   - Đơn hàng mới nhất: #${result.orders[0].code || result.orders[0]._id.slice(-6)}`);
    }
    console.log('');

    // Test getTopProducts
    console.log('🏆 Test getTopProducts:');
    result = null;
    const mockRes4 = { json: (data) => { result = data; } };
    await getTopProducts({}, mockRes4);
    console.log('   ✅ Thành công');
    console.log(`   - Số sản phẩm bán chạy: ${result.products?.length || 0}`);
    if (result.products?.length > 0) {
      console.log(`   - Sản phẩm bán chạy nhất: ${result.products[0].name}`);
      console.log(`   - Đã bán: ${result.products[0].totalSold} sản phẩm`);
    }
    console.log('');

    console.log('🎉 Tất cả API dashboard hoạt động tốt!');

  } catch (error) {
    console.error('❌ Lỗi khi test dashboard API:', error);
  }
}

// Chạy test
const main = async () => {
  await connectDB();
  await testDashboardAPI();
  await mongoose.connection.close();
  console.log('👋 Đã đóng kết nối database');
  process.exit(0);
};

main().catch(console.error);
