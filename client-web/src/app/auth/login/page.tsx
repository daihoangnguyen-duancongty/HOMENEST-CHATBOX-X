'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAll } from '@/api/auth';
import { useAuthStore } from '@/store/authSlice';
import SuccessPopup from '@/components/SuccessPopup';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gọi API login
     const { token, user } = await loginAll({ username, password, clientId });

      // Lưu token + user vào Zustand store
      login(token, user);
      // Hiển thị SuccessPopup
      setShowSuccess(true);

      // Sau 2s redirect sang dashboard
      setTimeout(() => {
        router.push('/protected/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };
  const handleRegister = () => {
    router.push('/auth/register');
  };
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-blue-500 to-green-500 p-4'>
      <div className='bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/30'>
        <Image
          src='https://homenest.com.vn/wp-content/uploads/2024/12/logo-HN-final-07-1.png'
          alt='Logo'
          width={100}
          height={100}
          className='mx-auto mb-4'
          priority
        />

        <h1 className='text-3xl font-bold text-white text-center mb-6'>
          Đăng nhập
        </h1>

        <form onSubmit={handleLogin} className='flex flex-col space-y-4'>
          <input
            className='px-4 py-3 rounded-xl bg-white/80 focus:bg-white border border-white/50 outline-none focus:ring-2 focus:ring-pink-400 transition'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
          />

          <input
            className='px-4 py-3 rounded-xl bg-white/80 focus:bg-white border border-white/50 outline-none focus:ring-2 focus:ring-pink-400 transition'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            type='password'
          />
<input
  className='px-4 py-3 rounded-xl bg-white/80 focus:bg-white border border-white/50 outline-none focus:ring-2 focus:ring-pink-400 transition'
  value={clientId}
  onChange={(e) => setClientId(e.target.value)}
  placeholder='Client Key'
/>
          <button
            type='submit'
            className='w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition'
          >
            Login
          </button>

          {error && (
            <p className='text-red-200 text-center text-sm mt-2'>{error}</p>
          )}
        </form>
        {/* Nút dẫn đến trang đăng ký */}
        <div className='flex items-center justify-center gap-2 mt-4 text-white'>
          <span>Chưa có tài khoản?</span>

          <button
            onClick={handleRegister}
            className='px-4 py-1 rounded-lg bg-white/30 border border-white/40 font-medium hover:bg-white/40 transition'
          >
            Đăng ký
          </button>
        </div>
      </div>
      {/* SuccessPopup */}
      <SuccessPopup
        open={showSuccess}
        message='Đăng nhập thành công!'
        onClose={() => setShowSuccess(false)}
        autoClose={true}
        duration={1000}
      />
    </div>
  );
}
