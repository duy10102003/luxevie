import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  listBrandSections,
  adminListBrandSections,
  adminGetBrandSection,
  createBrandSection,
  updateBrandSection,
  deleteBrandSection,
} from '../controllers/brandSectionController.js';
import { createBrandSectionSchema, updateBrandSectionSchema } from '../validators/brandSectionSchemas.js';

const router = Router();

// Public: Lấy danh sách brand sections active
router.get('/brand-sections', listBrandSections);

// Admin: Quản lý brand sections
router.get('/admin/brand-sections', authenticate, requireAdmin, adminListBrandSections);
router.get('/admin/brand-sections/:id', authenticate, requireAdmin, adminGetBrandSection);
router.post('/admin/brand-sections', authenticate, requireAdmin, validate(createBrandSectionSchema), createBrandSection);
router.put('/admin/brand-sections/:id', authenticate, requireAdmin, validate(updateBrandSectionSchema), updateBrandSection);
router.delete('/admin/brand-sections/:id', authenticate, requireAdmin, deleteBrandSection);

export default router;

