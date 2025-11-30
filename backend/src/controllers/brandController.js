import { Brand } from '../models/Brand.js';
import { slugify } from '../utils/slugify.js';

// Public: Lấy danh sách brands active (cho frontend)
export const listBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ active: true })
      .sort({ order: 1, name: 1 })
      .lean();
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Lấy danh sách tất cả brands
export const adminListBrands = async (req, res) => {
  try {
    const brands = await Brand.find({})
      .sort({ order: 1, name: 1 })
      .lean();
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Lấy một brand theo ID
export const adminGetBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id).lean();
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ brand });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Tạo brand mới
export const createBrand = async (req, res) => {
  try {
    const { name, logo, description, active, order } = req.body || {};
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const slug = slugify(name);
    const exists = await Brand.findOne({ $or: [{ slug }, { name: name.trim() }] });
    
    if (exists) {
      return res.status(409).json({ 
        code: 'BRAND_TAKEN', 
        message: 'Brand already exists' 
      });
    }

    const brand = await Brand.create({
      name: name.trim(),
      slug,
      logo: logo || null,
      description: description || '',
      active: active !== undefined ? active : true,
      order: order || 0
    });

    res.status(201).json({ brand });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        code: 'BRAND_TAKEN', 
        message: 'Brand already exists' 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Admin: Cập nhật brand
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = { ...req.body };
    
    if (patch.name) {
      patch.name = patch.name.trim();
      patch.slug = slugify(patch.name);
    }

    const brand = await Brand.findByIdAndUpdate(
      id,
      { $set: patch },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ brand });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        code: 'BRAND_TAKEN', 
        message: 'Brand already exists' 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Admin: Xóa brand
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

