// frontend/src/pages/Reset.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api, { extractError } from '../services/api';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';

export default function Reset() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [serverErr, setServerErr] = useState(null);

  const tokenFromQuery = params.get('token') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { token: tokenFromQuery, newPassword: '' },
  });

  useEffect(() => {
    const t = params.get('token');
    if (t) setValue('token', t, { shouldValidate: true });
  }, [params, setValue]);

  const onSubmit = async (formData) => {
    setServerErr(null);
    try {
      // Gửi đúng field backend mong đợi
      const { data } = await api.post('/auth/reset-password', {
        token: formData.token,
        password: formData.newPassword,
      });
      alert('Mật khẩu đã được đặt lại thành công!');
      nav('/login', { replace: true });
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  return (
    <AuthCard title="Đặt lại mật khẩu">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Token"
          error={errors.token?.message}
          readOnly={!!tokenFromQuery}
          {...register('token', { required: 'Token là bắt buộc' })}
        />
        <TextInput
          label="Mật khẩu mới"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'Mật khẩu là bắt buộc',
            minLength: { value: 6, message: 'Ít nhất 6 ký tự' },
          })}
        />
        <button
          disabled={isSubmitting}
          className="w-full mt-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Đặt lại mật khẩu
        </button>
      </form>

      {serverErr && (
        <div style={{ marginTop: 8 }}>
          <pre style={{ color: 'crimson' }}>{serverErr.message}</pre>
          <div style={{ marginTop: 6 }}>
            Link hết hạn? <Link to="/forgot">Gửi lại reset link</Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
