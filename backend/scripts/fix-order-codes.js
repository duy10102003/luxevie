// Script để sửa các đơn hàng cũ không có code
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

// Hàm tạo mã đơn hàng
function genOrderCode() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rnd = Math.floor(Math.random() * 900 + 100); // 3 số
  return `ODR${y}${m}${day}-${rnd}`;
}

// Hàm sửa các đơn hàng không có code
async function fixOrderCodes() {
  try {
    console.log('🔍 Tìm kiếm đơn hàng không có code...');
    
    const ordersWithoutCode = await Order.find({
      $or: [
        { code: { $exists: false } },
        { code: null },
        { code: '' }
      ]
    });

    console.log(`📦 Tìm thấy ${ordersWithoutCode.length} đơn hàng không có code`);

    if (ordersWithoutCode.length === 0) {
      console.log('✅ Tất cả đơn hàng đã có code!');
      return;
    }

    console.log('🔧 Đang tạo code cho các đơn hàng...');
    
    for (const order of ordersWithoutCode) {
      const newCode = genOrderCode();
      
      // Kiểm tra code có trùng không
      const existingOrder = await Order.findOne({ code: newCode });
      if (existingOrder) {
        console.log(`⚠️  Code ${newCode} đã tồn tại, tạo code mới...`);
        continue;
      }

      await Order.findByIdAndUpdate(order._id, { code: newCode });
      console.log(`✅ Đã tạo code ${newCode} cho đơn hàng ${order._id}`);
    }

    console.log('🎉 Hoàn thành việc tạo code cho đơn hàng!');
    
    // Kiểm tra lại
    const remainingOrders = await Order.find({
      $or: [
        { code: { $exists: false } },
        { code: null },
        { code: '' }
      ]
    });
    
    console.log(`📊 Còn lại ${remainingOrders.length} đơn hàng chưa có code`);

  } catch (error) {
    console.error('❌ Lỗi khi sửa code đơn hàng:', error);
  }
}

// Chạy script
const main = async () => {
  await connectDB();
  await fixOrderCodes();
  await mongoose.connection.close();
  console.log('👋 Đã đóng kết nối database');
  process.exit(0);
};

main().catch(console.error);
