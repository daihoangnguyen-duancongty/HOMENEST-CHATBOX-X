
// Tạo nhân viên cho Client owner
'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/config/fetcher';
import SuccessPopup from '@/components/SuccessPopup';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('name', name);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await fetcher('/api/client/create-employee', {
        method: 'POST',
        data: formData, // Gửi formData
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Hiển thị SuccessPopup
      setShowSuccess(true);

      // Sau 2s redirect sang login
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Register failed');
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
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
          Đăng ký tài khoản
        </h1>

        <form onSubmit={handleRegister} className='flex flex-col space-y-4'>
          <input
            type='file'
            accept='image/*'
            className='px-4 py-3 rounded-xl bg-white/80 border border-white/50'
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />

          <input
            className='px-4 py-3 rounded-xl bg-white/80 focus:bg-white border border-white/50 outline-none focus:ring-2 focus:ring-pink-400 transition'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Name'
          />

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

          <button
            type='submit'
            className='w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition'
          >
            Đăng ký
          </button>

          {error && (
            <p className='text-red-200 text-center text-sm mt-2'>{error}</p>
          )}
        </form>

        <div className='flex items-center justify-center gap-2 mt-4 text-white'>
          <span>Đã có tài khoản?</span>
          <button
            onClick={handleLogin}
            className='px-4 py-1 rounded-lg bg-white/30 border border-white/40 font-medium hover:bg-white/40 transition'
          >
            Đăng nhập
          </button>
        </div>
      </div>

      {/* SuccessPopup */}
      <SuccessPopup
        open={showSuccess}
        message='Đăng ký thành công!'
        onClose={() => setShowSuccess(false)}
        autoClose={true}
        duration={1000}
      />
    </div>
  );
}
