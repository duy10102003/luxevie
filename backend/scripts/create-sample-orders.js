// Script tạo đơn hàng mẫu để test
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

// Hàm tạo mã đơn hàng
function genOrderCode() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rnd = Math.floor(Math.random() * 900 + 100);
  return `ODR${y}${m}${day}-${rnd}`;
}

// Tạo đơn hàng mẫu
async function createSampleOrders() {
  try {
    console.log('🔍 Kiểm tra đơn hàng hiện có...');
    const existingOrders = await Order.countDocuments();
    console.log(`📦 Hiện có ${existingOrders} đơn hàng`);

    if (existingOrders > 0) {
      console.log('✅ Đã có đơn hàng trong database');
      return;
    }

    console.log('🔧 Tạo đơn hàng mẫu...');

    // Tạo user mẫu nếu chưa có
    let sampleUser = await User.findOne();
    if (!sampleUser) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('password123', 10);
      
      sampleUser = await User.create({
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        passwordHash: hashedPassword,
        phone: '0123456789'
      });
      console.log('✅ Đã tạo user mẫu');
    }

    // Tạo các đơn hàng mẫu
    const sampleOrders = [
      {
        code: genOrderCode(),
        userId: sampleUser._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: 'Áo thun nam',
            price: 150000,
            qty: 2
          }
        ],
        shippingAddress: {
          fullName: 'Nguyễn Văn A',
          phone: '0123456789',
          email: 'nguyenvana@example.com',
          line1: '123 Đường ABC',
          ward: 'Phường 1',
          district: 'Quận 1',
          city: 'TP.HCM'
        },
        subtotal: 300000,
        total: 300000,
        status: 'pending',
        paid: false
      },
      {
        code: genOrderCode(),
        userId: sampleUser._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: 'Quần jean nữ',
            price: 250000,
            qty: 1
          }
        ],
        shippingAddress: {
          fullName: 'Trần Thị B',
          phone: '0987654321',
          email: 'tranthib@example.com',
          line1: '456 Đường XYZ',
          ward: 'Phường 2',
          district: 'Quận 2',
          city: 'TP.HCM'
        },
        subtotal: 250000,
        total: 250000,
        status: 'confirmed',
        paid: true
      },
      {
        code: genOrderCode(),
        userId: sampleUser._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: 'Giày thể thao',
            price: 500000,
            qty: 1
          }
        ],
        shippingAddress: {
          fullName: 'Lê Văn C',
          phone: '0369852147',
          email: 'levanc@example.com',
          line1: '789 Đường DEF',
          ward: 'Phường 3',
          district: 'Quận 3',
          city: 'TP.HCM'
        },
        subtotal: 500000,
        total: 500000,
        status: 'delivered',
        paid: true
      }
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Đã tạo ${createdOrders.length} đơn hàng mẫu`);

    // Hiển thị thông tin các đơn hàng đã tạo
    console.log('\n📦 Các đơn hàng đã tạo:');
    createdOrders.forEach((order, index) => {
      console.log(`${index + 1}. Code: ${order.code}`);
      console.log(`   ID: ${order._id}`);
      console.log(`   Tên: ${order.shippingAddress.fullName}`);
      console.log(`   SĐT: ${order.shippingAddress.phone}`);
      console.log(`   Email: ${order.shippingAddress.email}`);
      console.log(`   Trạng thái: ${order.status}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Lỗi khi tạo đơn hàng mẫu:', error);
  }
}

// Chạy script
const main = async () => {
  await connectDB();
  await createSampleOrders();
  await mongoose.connection.close();
  console.log('👋 Đã đóng kết nối database');
  process.exit(0);
};

main().catch(console.error);
