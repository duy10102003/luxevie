// src/pages/Login.jsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api, { extractError, loginWithGoogle } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ. Vui lòng nhập đúng định dạng email'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

function safePath(p) {
  if (typeof p !== 'string') return '/';
  if (!p.startsWith('/')) return '/';
  if (['/login','/register'].includes(p)) return '/';
  return p;
}

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [serverErr, setServerErr] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields, isSubmitted } } =
    useForm({ 
      resolver: zodResolver(schema),
      mode: 'onSubmit', // Chỉ validate khi submit
      reValidateMode: 'onBlur', // Re-validate khi blur sau khi đã submit
    });

  const redirectAfterLogin = () => {
    const from = loc.state?.from;
    nav(safePath(from) || '/', { replace: true });
  };

  const onSubmit = async (values) => {
    setServerErr(null);
    try {
      const { data } = await api.post('/auth/login', values); // { user, token }
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }));
      login(data.token);
      redirectAfterLogin();
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  const onGoogleSuccess = async (resp) => {
    setServerErr(null);
    try {
      // dùng service helper hoặc gọi api.post('/auth/google', { credential })
      const data = await loginWithGoogle(resp.credential); // { token, user }
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }));
      login(data.token);
      redirectAfterLogin();
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  const onGoogleError = () => setServerErr({ message: 'Google login failed' });

  return (
    <AuthCard title="Đăng nhập">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TextInput 
          label="Email" 
          type="email"
          error={(isSubmitted || touchedFields.email) && errors.email ? errors.email.message : undefined} 
          {...register('email')} 
        />
        <TextInput 
          label="Mật khẩu" 
          type="password" 
          error={(isSubmitted || touchedFields.password) && errors.password ? errors.password.message : undefined} 
          {...register('password')} 
        />
        <button disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Signing in…' : 'Đăng nhập'}
        </button>
      </form>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <>
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">hoặc</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
          </div>
        </>
      )}

      {serverErr && (
        <div className="mt-4 p-3 rounded-lg border border-red-200 text-red-700 text-sm">
          {serverErr.message}
        </div>
      )}

      <div className="mt-4 text-center">
        <Link to="/forgot" className="link text-sm">Quên mật khẩu?</Link>
      </div>
      <div className="mt-2 text-center text-sm">
        Chưa có tài khoản? <Link to="/register" className="link">Đăng ký</Link>
      </div>
    </AuthCard>
  );
}
