import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true
    },
    logo: {
      type: String,
      default: null,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    },
    order: {
      type: Number,
      default: 0,
      index: true
    }
  },
  { timestamps: true }
);

export const Brand = mongoose.model('Brand', BrandSchema);

