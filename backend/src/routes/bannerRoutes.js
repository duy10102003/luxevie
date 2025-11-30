import { Router } from 'express';
import {
  listBanners,
  adminListBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';

const router = Router();

// Public: Lấy danh sách banners active
router.get('/banners', listBanners);

// Admin: Quản lý banners
router.get('/admin/banners', adminListBanners);
router.post('/admin/banners', createBanner);
router.put('/admin/banners/:id', updateBanner);
router.delete('/admin/banners/:id', deleteBanner);

export default router;

