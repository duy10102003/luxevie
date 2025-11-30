import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '' }, // URL đích khi click vào banner
  order: { type: Number, default: 0 }, // Thứ tự hiển thị
  active: { type: Boolean, default: true }, // Có hiển thị hay không
}, { timestamps: true });

export const Banner = mongoose.model('Banner', BannerSchema);

