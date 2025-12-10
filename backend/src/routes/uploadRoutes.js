import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { upload, uploadImage } from '../controllers/uploadController.js';

const router = Router();
// Admin upload ảnh
router.post('/upload/image', authenticate, requireAdmin, upload.single('file'), uploadImage);
// User upload avatar
router.post('/upload/profile-image', authenticate, upload.single('file'), uploadImage);

export default router;
