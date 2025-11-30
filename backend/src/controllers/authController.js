import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { sendMail } from '../utils/sendMail.js';

// ========== REGISTER ==========
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailNorm = (email || '').trim().toLowerCase();

  const exists = await User.findOne({ email: emailNorm });
  if (exists) {
    const err = new Error('Email already exists');
    err.status = 409; err.code = 'EMAIL_TAKEN';
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: emailNorm, passwordHash });

  const token = signToken({ sub: user._id, email: user.email, role: user.role });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  const { email, password } = req.body;
  const emailNorm = (email || '').trim().toLowerCase();

  const user = await User.findOne({ email: emailNorm });
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.status = 401; err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  if (user.status !== 'active') {
    const err = new Error('User inactive');
    err.status = 403; err.code = 'USER_INACTIVE';
    throw err;
  }

  const token = signToken({ sub: user._id, email: user.email, role: user.role });
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
};

// ========== ME ==========
export const me = async (req, res) => {
  const user = await User
    .findById(req.user.sub)
    .select('_id name email role status avatarUrl phone address dob gender createdAt');
  res.json({ user });
};

// ========== FORGOT PASSWORD ==========
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Không tiết lộ user tồn tại
    if (!user) return res.json({ message: 'If this email exists, a reset link has been sent.' });

    // Tạo token reset: lưu HASH + HSD
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    user.resetTokenHash = hash;
    user.resetTokenExp = new Date(Date.now() + 1000 * 60 * 30); // 30 phút
    await user.save();

    const base = (process.env.APP_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const link = `${base}/reset?token=${token}`;

    await sendMail({
      to: user.email,
      subject: 'Đặt lại mật khẩu',
      html: `<p>Nhấn để đặt lại mật khẩu (hiệu lực 30 phút):</p><p><a href="${link}">${link}</a></p>`
    });

    // DEV helper
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ ok: true, dev: { token, resetUrl: link } });
    }

    return res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (e) { next(e); }
};


// ========== RESET PASSWORD ==========
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.body || {};
    const rawPassword = req.body?.password ?? req.body?.newPassword; // chấp nhận cả 2
    if (!token || !rawPassword) {
      return res.status(400).json({ message: 'Thiếu token hoặc mật khẩu' });
    }

    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetTokenHash: hash,
      resetTokenExp: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // cập nhật đúng field hash mà hệ thống đang sử dụng
    user.passwordHash = await bcrypt.hash(rawPassword, 10);
    user.resetTokenHash = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.json({ ok: true, message: 'Password updated' });
  } catch (e) {
    next(e);
  }
};

// ========== CHANGE PASSWORD ==========
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.sub);
  if (!user) {
    const err = new Error('Unauthorized');
    err.status = 401; err.code = 'UNAUTHORIZED';
    throw err;
  }

  const ok = await user.comparePassword(currentPassword);
  if (!ok) {
    const err = new Error('Current password incorrect');
    err.status = 400; err.code = 'WRONG_PASSWORD';
    throw err;
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password changed' });
};

// ========== GOOGLE LOGIN ==========
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (req, res, next) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ message: 'Missing credential' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // email, email_verified, name, picture, sub

    if (!payload?.email_verified) {
      return res.status(400).json({ message: 'Email chưa được Google xác minh' });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: payload.name || email.split('@')[0],
        provider: 'google',
        providerId: payload.sub,
        passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
        avatarUrl: payload.picture,
        role: 'user',
        status: 'active',
      });
    }

    const token = signToken({ sub: user._id, email: user.email, role: user.role });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { next(e); }
};
