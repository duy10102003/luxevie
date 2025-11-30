import mongoose from 'mongoose';

const BrandSectionSchema = new mongoose.Schema(
  {
    sectionName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    brand: { 
      type: String, 
      required: true,
      enum: [
        "Beverly Hills Polo Club",
        "FILA",
        "Converse",
        "Havaianas",
        "Gigi",
        "MLB",
        "Nike",
        "Pedro"
      ],
      trim: true,
      index: true
    },
    bannerImage: { 
      type: String, 
      required: true, 
      trim: true 
    },
    productIds: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
    }],
    order: { 
      type: Number, 
      default: 0, 
      index: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active', 
      index: true 
    },
  },
  { timestamps: true }
);

// Validate productIds array length (custom validator at schema level)
BrandSectionSchema.pre('save', function(next) {
  if (this.productIds && this.productIds.length > 8) {
    const error = new Error('Maximum 8 products allowed');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

export const BrandSection = mongoose.model('BrandSection', BrandSectionSchema);

