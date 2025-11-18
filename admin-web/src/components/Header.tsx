'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  if (!user) return null; // nếu chưa login, không hiện header

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        {/* Tên user */}
        <div>
          <p className="text-gray-800 font-semibold">{user.name}</p>
          <p className="text-gray-500 text-sm capitalize">{user.role}</p>
        </div>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
