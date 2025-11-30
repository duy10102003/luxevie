import { Banner } from '../models/Banner.js';

// Lấy danh sách banners (public - chỉ lấy active)
export const listBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .select('imageUrl linkUrl order')
      .lean();
    res.json({ items: banners });
  } catch (error) {
    console.error('Error listing banners:', error);
    res.status(500).json({ error: 'Failed to list banners' });
  }
};

// Admin: Lấy tất cả banners
export const adminListBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ items: banners });
  } catch (error) {
    console.error('Error listing banners:', error);
    res.status(500).json({ error: 'Failed to list banners' });
  }
};

// Admin: Tạo banner mới
export const createBanner = async (req, res) => {
  try {
    const { imageUrl, linkUrl = '', order = 0, active = true } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    const banner = new Banner({
      imageUrl,
      linkUrl,
      order: Number(order) || 0,
      active: active !== false,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
};

// Admin: Cập nhật banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, linkUrl, order, active } = req.body;

    const updateData = {};
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (order !== undefined) updateData.order = Number(order) || 0;
    if (active !== undefined) updateData.active = active;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
};

// Admin: Xóa banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};

