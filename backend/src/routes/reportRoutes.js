// backend/src/routes/reportRoutes.js
import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { exportExcel } from '../controllers/reportController.js';

const router = Router();

// Tất cả routes đều yêu cầu admin (phải authenticate trước để có req.user)
router.use(authenticate, requireAdmin);

// GET /api/report/export-excel?month=MM&year=YYYY
router.get('/export-excel', exportExcel);

export default router;

