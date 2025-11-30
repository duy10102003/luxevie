import { BrandSection } from '../models/BrandSection.js';
import { Product } from '../models/Product.js';

// Public: Lấy danh sách brand sections active
export const listBrandSections = async (req, res) => {
  try {
    const sections = await BrandSection.find({ status: 'active' })
      .sort({ order: 1 })
      .populate({
        path: 'productIds',
        select: 'name images price salePrice brand',
      })
      .lean();

    res.json({ items: sections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Lấy tất cả brand sections
export const adminListBrandSections = async (req, res) => {
  try {
    const sections = await BrandSection.find()
      .sort({ order: 1 })
      .populate({
        path: 'productIds',
        select: 'name images price salePrice brand',
      })
      .lean();

    res.json({ items: sections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Lấy một brand section theo ID
export const adminGetBrandSection = async (req, res) => {
  try {
    const section = await BrandSection.findById(req.params.id)
      .populate({
        path: 'productIds',
        select: 'name images price salePrice brand',
      })
      .lean();

    if (!section) {
      return res.status(404).json({ message: 'Brand section not found' });
    }

    res.json({ item: section });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Tạo brand section mới
export const createBrandSection = async (req, res) => {
  try {
    const { sectionName, brand, bannerImage, productIds, order, status } = req.body;

    // Validate productIds - tối đa 8
    if (productIds && productIds.length > 8) {
      return res.status(400).json({ message: 'Maximum 8 products allowed' });
    }

    // Validate products exist and belong to the brand
    if (productIds && productIds.length > 0) {
      const products = await Product.find({ _id: { $in: productIds }, brand });
      if (products.length !== productIds.length) {
        return res.status(400).json({ message: 'Some products not found or brand mismatch' });
      }
    }

    const section = new BrandSection({
      sectionName,
      brand,
      bannerImage,
      productIds: productIds || [],
      order: Number(order) || 0,
      status: status || 'active',
    });

    await section.save();
    const populated = await BrandSection.findById(section._id)
      .populate({
        path: 'productIds',
        select: 'name images price salePrice brand',
      })
      .lean();

    res.status(201).json({ item: populated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Cập nhật brand section
export const updateBrandSection = async (req, res) => {
  try {
    const { sectionName, brand, bannerImage, productIds, order, status } = req.body;

    const section = await BrandSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Brand section not found' });
    }

    // Validate productIds - tối đa 8
    if (productIds && productIds.length > 8) {
      return res.status(400).json({ message: 'Maximum 8 products allowed' });
    }

    // Validate products exist and belong to the brand (if brand changed, use new brand)
    const targetBrand = brand || section.brand;
    if (productIds && productIds.length > 0) {
      const products = await Product.find({ _id: { $in: productIds }, brand: targetBrand });
      if (products.length !== productIds.length) {
        return res.status(400).json({ message: 'Some products not found or brand mismatch' });
      }
    }

    // Update fields
    if (sectionName !== undefined) section.sectionName = sectionName;
    if (brand !== undefined) section.brand = brand;
    if (bannerImage !== undefined) section.bannerImage = bannerImage;
    if (productIds !== undefined) section.productIds = productIds;
    if (order !== undefined) section.order = Number(order);
    if (status !== undefined) section.status = status;

    await section.save();
    const populated = await BrandSection.findById(section._id)
      .populate({
        path: 'productIds',
        select: 'name images price salePrice brand',
      })
      .lean();

    res.json({ item: populated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Xóa brand section
export const deleteBrandSection = async (req, res) => {
  try {
    const section = await BrandSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Brand section not found' });
    }
    res.json({ message: 'Brand section deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

