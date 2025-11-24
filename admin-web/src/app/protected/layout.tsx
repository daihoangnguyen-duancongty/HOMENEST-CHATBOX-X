'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authSlice';
import { getToken } from '@/config/token';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, logout } = useAuthStore();

  useEffect(() => {
    const storedToken = token || getToken();
    if (!storedToken) {
      logout();
      router.replace('/auth/login');
    }
  }, [token, logout, router]);

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      {/* Sidebar cố định */}
      <Sidebar className='fixed top-0 left-0 h-screen w-64' />

      {/* Nội dung chính scroll được */}
      <main className='flex-1 ml-64 p-8 overflow-auto'>{children}</main>
    </div>
  );
}
