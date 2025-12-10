
import { verifyToken } from '../utils/jwt.js';

/**
 * Xác thực JWT từ header Authorization: Bearer <token>
 * -> Gắn req.user = { sub, email, role }
 */
export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    const err = new Error('Unauthorized');
    err.status = 401; err.code = 'UNAUTHORIZED';
    return next(err);
  }

  try {
    const payload = verifyToken(token); // { sub, email, role, iat, exp }
    req.user = { sub: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch {
    const err = new Error('Unauthorized');
    err.status = 401; err.code = 'UNAUTHORIZED';
    return next(err);
  }
};



/**
 * Xác thực JWT nếu có token. Nếu không có hoặc lỗi token -> req.user = null, nhưng không throw 401.
 */
export const optionalAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.user = { sub: payload.sub, email: payload.email, role: payload.role };
  } catch {
    // Token lỗi -> coi như user chưa đăng nhập
    req.user = null;
  }
  next();
};

/** Chỉ cho phép admin */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    const err = new Error('Forbidden');
    err.status = 403; err.code = 'FORBIDDEN';
    return next(err);
  }
  next();
};

// (tuỳ) giữ alias cho code cũ nếu nơi nào đó dùng authRequired:
export const authRequired = authenticate;
