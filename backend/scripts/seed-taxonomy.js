import 'dotenv/config';
import mongoose from 'mongoose';
import { slugify } from '../src/utils/slugify.js';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: String, default: null },
  gender: { type: String, enum: ['nam', 'nu'], required: true },
  image: String,
  description: String,
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { collection: 'categories' });

const Category = mongoose.model('Category', CategorySchema);

const DATA = {
  genders: [
    { name: 'Nam', slug: 'nam' },
    { name: 'Nữ', slug: 'nu' },
  ],
  categories: {
    'quan': {
      name: 'QUẦN',
      subs: ['quan-jean', 'quan-short', 'quan-au-nam', 'quan-jogger', 'vay']
    },
    'ao': {
      name: 'ÁO',
      subs: ['ao-thun', 'ao-so-mi', 'ao-hoodie', 'ao-khoac', 'ao-polo']
    },
    'giay-dep': {
      name: 'GIÀY DÉP',
      subs: ['giay-chay-bo', 'dep-quai-cheo', 'dep-kep', 'giay-tay']
    },
    'tui-vi': {
      name: 'TÚI VÍ',
      subs: ['balo', 'tui-deo-vai', 'tui-xach', 'vi-dung-passport'] // loại bỏ 'tui-vi' để tránh trùng với top slug
    },
    'mat-kinh': {
      name: 'MẮT KÍNH',
      subs: [
        'gong-kinh-tron', 'gong-kinh-vuong', 'kinh-mat-gong-oval',
        'kinh-mat-gong-tron', 'kinh-mat-gong-vuong',
        'gong-kinh-mat-meo', 'kinh-mat-gong-mat-meo'
      ]
    },
    'dong-ho': {
      name: 'ĐỒNG HỒ',
      subs: ['dong-ho-analog', 'dong-ho-thanh-lich', 'dong-ho-automatic', 'dong-ho-chronometer']
    },
    'phu-kien': {
      name: 'PHỤ KIỆN',
      subs: ['ca-vat', 'non-len', 'non-nua-dau', 'that-lung', 'tat']
    },
    'trang-suc': {
      name: 'TRANG SỨC',
      subs: ['nhan', 'vong-tay', 'vong-co', 'kep-ca-vat']
    },
  }
};

(async () => {
  await mongoose.connect(uri);

  // Ensure old conflicting indexes are removed (in case another process recreated them)
  try {
    await mongoose.connection.db.collection('categories').dropIndex('category_1');
  } catch {}
  try {
    await mongoose.connection.db.collection('categories').dropIndex('slug_1');
  } catch {}

  // Clean up legacy documents without gender to avoid unique collisions
  await mongoose.connection.db.collection('categories').deleteMany({});

  // Upsert top categories
  const tops = Object.entries(DATA.categories);
  for (let i = 0; i < tops.length; i++) {
    const [slug, cfg] = tops[i];
    for (const gender of ['nam', 'nu']) {
      await Category.updateOne(
        { category: slug, gender },
        { $set: { name: cfg.name, category: slug, slug, parent: null, order: i, active: true, gender } },
        { upsert: true }
      );
    }
  }

  // Upsert subcategories with parent
  for (const [topSlug, cfg] of tops) {
    for (let j = 0; j < cfg.subs.length; j++) {
      const sub = cfg.subs[j];
      for (const gender of ['nam', 'nu']) {
        await Category.updateOne(
          { category: sub, parent: topSlug, gender },
          { $set: { name: sub.replace(/-/g, ' ').toUpperCase(), category: sub, slug: sub, parent: topSlug, order: j, active: true, gender } },
          { upsert: true }
        );
      }
    }
  }

  const count = await Category.countDocuments();
  console.log('Categories total:', count);
  await mongoose.disconnect();
})();


