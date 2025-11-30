/* eslint-disable no-console */
// Seed brands vào MongoDB Atlas - Lưu dữ liệu từ frontend/src/components/Brands.jsx

import 'dotenv/config';
import mongoose from 'mongoose';
import { Brand } from '../src/models/Brand.js';
import { slugify } from '../src/utils/slugify.js';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI');

// Dữ liệu brands từ frontend/src/components/Brands.jsx
const BRANDS_DATA = [
  {
    name: 'Beverly Hills Polo Club',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017457/Beverly_zfymeo.jpg',
    order: 0
  },
  {
    name: 'FILA',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017451/FILA_bwdi4f.jpg',
    order: 1
  },
  {
    name: 'Converse',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017445/Converse_m1ndkb.jpg',
    order: 2
  },
  {
    name: 'Havaianas',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017438/Havaianas_wtk70p.jpg',
    order: 3
  },
  {
    name: 'Gigi',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017432/GIgi_wtdbio.jpg',
    order: 4
  },
  {
    name: 'MLB',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017428/MLB_f6ruzs.jpg',
    order: 5
  },
  {
    name: 'Nike',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017423/nike_rcswv1.jpg',
    order: 6
  },
  {
    name: 'Pedro',
    logo: 'https://res.cloudinary.com/dqawqvxcr/image/upload/v1762017418/pedro_2_mxzxji.jpg',
    order: 7
  },
];

async function seedBrands() {
  try {
    await mongoose.connect(uri);
    console.log('[db] Connected to MongoDB');

    let created = 0;
    let updated = 0;

    for (const brandData of BRANDS_DATA) {
      const slug = slugify(brandData.name);
      const result = await Brand.updateOne(
        { slug },
        {
          $set: {
            name: brandData.name,
            slug,
            logo: brandData.logo,
            active: true,
            order: brandData.order,
            description: ''
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        created++;
        console.log(`✅ Created: ${brandData.name}`);
      } else if (result.modifiedCount > 0) {
        updated++;
        console.log(`🔄 Updated: ${brandData.name}`);
      } else {
        console.log(`⏭️  No changes: ${brandData.name}`);
      }
    }

    const total = await Brand.countDocuments();
    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Total brands in database: ${total}`);

    await mongoose.disconnect();
    console.log('[db] Disconnected');
    console.log('\n✅ Brands đã được lưu vào MongoDB Atlas!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedBrands();

