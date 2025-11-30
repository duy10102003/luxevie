import { useState } from 'react';
import api, { extractError } from '../services/api';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ email: z.string().email('Invalid email') });

export default function Forgot() {
  const [serverErr, setServerErr] = useState(null);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerErr(null);
    try {
      await api.post('/auth/forgot-password', values);
      setSent(true); // Chỉ hiển thị hướng dẫn kiểm tra email
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  return (
    <AuthCard title="Forgot password">
      {sent ? (
        <div className="text-sm text-gray-700 space-y-2">
          <p>Chúng tôi đã gửi đường dẫn đặt lại mật khẩu vào email của bạn.</p>
          <ul className="list-disc ml-5">
            <li>Kiểm tra hộp thư đến hoặc thư mục Spam/Quảng cáo.</li>
            <li>Link có thời hạn, vui lòng thực hiện sớm.</li>
          </ul>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Email" error={errors.email?.message} {...register('email')} />
          <button disabled={isSubmitting} style={{width:'100%', padding:'10px 12px'}}>
            Send reset link
          </button>
        </form>
      )}

      {serverErr && <pre style={{color:'crimson', marginTop:8}}>{serverErr.message}</pre>}
    </AuthCard>
  );
}
