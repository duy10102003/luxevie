import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import {
  listBrands,
  adminListBrands,
  adminGetBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';

const router = Router();

// Public: Lấy danh sách brands active
router.get('/brands', listBrands);

// Admin: Quản lý brands
router.get('/admin/brands', authenticate, requireAdmin, adminListBrands);
router.get('/admin/brands/:id', authenticate, requireAdmin, adminGetBrand);
router.post('/admin/brands', authenticate, requireAdmin, createBrand);
router.patch('/admin/brands/:id', authenticate, requireAdmin, updateBrand);
router.delete('/admin/brands/:id', authenticate, requireAdmin, deleteBrand);

export default router;

