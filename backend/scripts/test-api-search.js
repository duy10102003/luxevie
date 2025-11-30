// Script test API tìm kiếm đơn hàng
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

// Hàm test API tìm kiếm (giống như frontend gọi)
async function testAPISearch() {
  try {
    console.log('🔍 Test API tìm kiếm đơn hàng...\n');

    // Lấy một đơn hàng mẫu
    const sampleOrder = await Order.findOne().lean();
    
    if (!sampleOrder) {
      console.log('❌ Không có đơn hàng nào trong database');
      return;
    }

    console.log('📦 Đơn hàng mẫu:');
    console.log(`   ID: ${sampleOrder._id}`);
    console.log(`   Code: ${sampleOrder.code || 'Không có'}`);
    console.log(`   Tên: ${sampleOrder.shippingAddress?.fullName || 'Không có'}`);
    console.log(`   SĐT: ${sampleOrder.shippingAddress?.phone || 'Không có'}`);
    console.log(`   Email: ${sampleOrder.shippingAddress?.email || 'Không có'}`);
    console.log('');

    // Test các trường hợp tìm kiếm
    const testCases = [
      {
        name: 'Tìm kiếm theo code',
        query: { q: sampleOrder.code },
        expected: 1
      },
      {
        name: 'Tìm kiếm theo ID đầy đủ',
        query: { q: sampleOrder._id.toString() },
        expected: 1
      },
      {
        name: 'Tìm kiếm theo 6 ký tự cuối ID',
        query: { q: sampleOrder._id.toString().slice(-6) },
        expected: 1
      },
      {
        name: 'Tìm kiếm theo tên',
        query: { q: sampleOrder.shippingAddress?.fullName },
        expected: sampleOrder.shippingAddress?.fullName ? 1 : 0
      },
      {
        name: 'Tìm kiếm theo SĐT',
        query: { q: sampleOrder.shippingAddress?.phone },
        expected: sampleOrder.shippingAddress?.phone ? 1 : 0
      },
      {
        name: 'Tìm kiếm theo email',
        query: { q: sampleOrder.shippingAddress?.email },
        expected: sampleOrder.shippingAddress?.email ? 1 : 0
      },
      {
        name: 'Tìm kiếm không có kết quả',
        query: { q: 'khongtimthay123' },
        expected: 0
      }
    ];

    // Import controller để test
    const { adminListOrders } = await import('../src/controllers/adminOrderController.js');

    for (const testCase of testCases) {
      console.log(`🔍 ${testCase.name}:`);
      console.log(`   Query: ${JSON.stringify(testCase.query)}`);
      
      try {
        // Tạo mock request và response
        const mockReq = {
          query: testCase.query
        };
        
        let result = null;
        const mockRes = {
          json: (data) => {
            result = data;
          }
        };

        await adminListOrders(mockReq, mockRes);
        
        const actualCount = result?.items?.length || 0;
        const status = actualCount === testCase.expected ? '✅' : '❌';
        
        console.log(`   Kết quả: ${actualCount} đơn hàng (mong đợi: ${testCase.expected}) ${status}`);
        
        if (actualCount > 0) {
          console.log(`   Đơn hàng tìm thấy: ${result.items[0].code || result.items[0]._id}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Lỗi: ${error.message}`);
      }
      
      console.log('');
    }

    console.log('✅ Test API hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi khi test API:', error);
  }
}

// Chạy test
const main = async () => {
  await connectDB();
  await testAPISearch();
  await mongoose.connection.close();
  console.log('👋 Đã đóng kết nối database');
  process.exit(0);
};

main().catch(console.error);
