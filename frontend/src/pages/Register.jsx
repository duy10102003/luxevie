import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api, { extractError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const [serverErr, setServerErr] = useState(null);

  const onSubmit = async (values) => {
    setServerErr(null);
    try {
      const { data } = await api.post('/auth/register', values);
      login(data.token);
      nav('/');
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  return (
    <AuthCard title="Đăng ký tài khoản">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TextInput 
          label="Họ và tên" 
          error={errors.name?.message} 
          {...register('name')} 
        />
        <TextInput 
          label="Email" 
          error={errors.email?.message} 
          {...register('email')} 
        />
        <TextInput 
          label="Mật khẩu" 
          type="password" 
          error={errors.password?.message} 
          {...register('password')} 
        />
        
        <button 
          disabled={isSubmitting} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tạo tài khoản...
            </div>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>

      {serverErr && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 text-sm font-medium">{serverErr.message}</span>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">Đã có tài khoản? </span>
        <Link 
          to="/login" 
          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </AuthCard>
  );
}
