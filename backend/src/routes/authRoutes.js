import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { authRequired } from '../middlewares/auth.js';
import {
  registerSchema, loginSchema, forgotSchema, resetSchema, changePasswordSchema
} from '../validators/authSchemas.js';
import {
  register, login, me, forgotPassword, resetPassword, changePassword, loginWithGoogle
} from '../controllers/authController.js';

const router = Router();

// ✅ Google login (JWT trả về)
// router.post('/auth/google', loginWithGoogle);
router.post('/google', loginWithGoogle);    
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authRequired, me);

router.post('/forgot-password', validate(forgotSchema), forgotPassword);
router.post('/reset-password', validate(resetSchema), resetPassword);
router.post('/change-password', authRequired, validate(changePasswordSchema), changePassword);

export default router;
