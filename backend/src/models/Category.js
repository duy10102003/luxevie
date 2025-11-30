// import mongoose from 'mongoose';

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   slug: { type: String, required: true, unique: true, index: true },
//   parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
//   image: { type: String },          // ảnh đại diện danh mục (nếu có)
//   description: { type: String },    // mô tả ngắn
//   sourceUrl: { type: String }       // nguồn (vd: yame.vn/collections/ao-thun)
// }, { timestamps: true });

// export default mongoose.model('Category', categorySchema);
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  category:  { type: String, required: true, index: true },
  slug: { type: String, required: true, index: true },
  parent: { type: String, default: null },
  gender: { type: String, enum: ['nam', 'nu'], required: true, index: true },
  image: { type: String, default: null },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  active:{ type: Boolean, default: true, index: true },
}, { timestamps: true });

// Unique index trên cặp (category, gender) và (slug, gender)
CategorySchema.index({ category: 1, gender: 1 }, { unique: true });
CategorySchema.index({ slug: 1, gender: 1 }, { unique: true });

export const Category = mongoose.model('Category', CategorySchema);
