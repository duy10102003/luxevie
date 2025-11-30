/* eslint-disable no-console */
// Script tạo tài khoản admin đầu tiên

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.js';
import { connectDB } from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createAdmin() {
  try {
    await connectDB();

    // Thông tin admin mặc định (có thể thay đổi)
    const email = process.env.ADMIN_EMAIL || 'vudevweb@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'vudevweb';
    const name = process.env.ADMIN_NAME || 'Admin';

    // Kiểm tra xem admin đã tồn tại chưa
    const exists = await User.findOne({ email });
    if (exists) {
      if (exists.role === 'admin') {
        console.log('✅ Admin đã tồn tại:', email);
        console.log('   Role:', exists.role);
        console.log('   Status:', exists.status);
      } else {
        // Nâng cấp user thường thành admin
        exists.role = 'admin';
        await exists.save();
        console.log('✅ Đã nâng cấp user thành admin:', email);
      }
      process.exit(0);
    }

    // Tạo admin mới
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await User.create({
      email,
      passwordHash,
      name,
      role: 'admin',
      status: 'active',
    });

    console.log('✅ Đã tạo admin thành công!');
    console.log('   Email:', admin.email);
    console.log('   Password:', password);
    console.log('   Role:', admin.role);
    console.log('\n⚠️  Lưu ý: Đổi mật khẩu sau khi đăng nhập!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error.message);
    process.exit(1);
  }
}

createAdmin();

