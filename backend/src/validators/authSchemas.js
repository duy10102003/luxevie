import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const forgotSchema = z.object({
  email: z.string().email()
});

export const resetSchema = z.union([
  z.object({
    token: z.string().min(10, 'Invalid token'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  z.object({
    token: z.string().min(10, 'Invalid token'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  }),
]).transform((data) => ({
  token: data.token,
  // chuẩn hoá về password cho controller
  password: data.password ?? data.newPassword,
}));

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
});
