// Script test chức năng tìm kiếm đơn hàng
import mongoose from 'mongoose';
import { Order } from '../src/models/Order.js';

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

// Hàm test tìm kiếm
async function testOrderSearch() {
  try {
    console.log('🔍 Test chức năng tìm kiếm đơn hàng...\n');

    // Lấy một số đơn hàng mẫu
    const sampleOrders = await Order.find().limit(5).lean();
    
    if (sampleOrders.length === 0) {
      console.log('❌ Không có đơn hàng nào trong database');
      return;
    }

    console.log('📦 Các đơn hàng mẫu:');
    sampleOrders.forEach((order, index) => {
      console.log(`${index + 1}. ID: ${order._id}`);
      console.log(`   Code: ${order.code || 'Không có'}`);
      console.log(`   Tên: ${order.shippingAddress?.fullName || 'Không có'}`);
      console.log(`   SĐT: ${order.shippingAddress?.phone || 'Không có'}`);
      console.log(`   Email: ${order.shippingAddress?.email || 'Không có'}`);
      console.log('');
    });

    // Test tìm kiếm theo code
    if (sampleOrders[0]?.code) {
      console.log(`🔍 Test tìm kiếm theo code: "${sampleOrders[0].code}"`);
      const codeResults = await Order.find({
        $or: [
          { code: { $exists: true, $ne: null, $regex: sampleOrders[0].code, $options: 'i' } }
        ]
      });
      console.log(`   Kết quả: ${codeResults.length} đơn hàng`);
    }

    // Test tìm kiếm theo ID
    const orderId = sampleOrders[0]._id.toString();
    console.log(`🔍 Test tìm kiếm theo ID: "${orderId}"`);
    const idResults = await Order.find({
      $or: [
        { _id: orderId }
      ]
    });
    console.log(`   Kết quả: ${idResults.length} đơn hàng`);

    // Test tìm kiếm theo 6 ký tự cuối ID
    const last6Chars = orderId.slice(-6);
    console.log(`🔍 Test tìm kiếm theo 6 ký tự cuối ID: "${last6Chars}"`);
    const last6Results = await Order.find({
      $or: [
        { 
          $expr: { 
            $regexMatch: { 
              input: { $toString: "$_id" }, 
              regex: last6Chars + '$', 
              options: 'i' 
            } 
          } 
        }
      ]
    });
    console.log(`   Kết quả: ${last6Results.length} đơn hàng`);

    // Test tìm kiếm theo tên
    if (sampleOrders[0]?.shippingAddress?.fullName) {
      const name = sampleOrders[0].shippingAddress.fullName;
      console.log(`🔍 Test tìm kiếm theo tên: "${name}"`);
      const nameResults = await Order.find({
        $or: [
          { 'shippingAddress.fullName': new RegExp(name, 'i') }
        ]
      });
      console.log(`   Kết quả: ${nameResults.length} đơn hàng`);
    }

    // Test tìm kiếm tổng hợp
    console.log(`🔍 Test tìm kiếm tổng hợp với từ khóa: "${last6Chars}"`);
    const combinedResults = await Order.find({
      $or: [
        { 'shippingAddress.fullName': new RegExp(last6Chars, 'i') },
        { 'shippingAddress.phone': new RegExp(last6Chars, 'i') },
        { 'shippingAddress.email': new RegExp(last6Chars, 'i') },
        { code: { $exists: true, $ne: null, $regex: last6Chars, $options: 'i' } },
        { 
          $expr: { 
            $regexMatch: { 
              input: { $toString: "$_id" }, 
              regex: last6Chars + '$', 
              options: 'i' 
            } 
          } 
        }
      ]
    });
    console.log(`   Kết quả: ${combinedResults.length} đơn hàng`);

    console.log('\n✅ Test hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi khi test tìm kiếm:', error);
  }
}

// Chạy test
const main = async () => {
  await connectDB();
  await testOrderSearch();
  await mongoose.connection.close();
  console.log('👋 Đã đóng kết nối database');
  process.exit(0);
};

main().catch(console.error);
