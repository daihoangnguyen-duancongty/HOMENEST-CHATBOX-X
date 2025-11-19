'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();          // Xóa token + user
    router.push('/auth/login'); // Redirect về login
  };

  return (
    <nav className="flex flex-col h-screen w-64 bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/admin/dashboard" className="hover:bg-gray-700 p-2 rounded block">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/clients" className="hover:bg-gray-700 p-2 rounded block">
            Clients
          </Link>
        </li>
        <li>
          <Link href="/admin/subscriptions" className="hover:bg-gray-700 p-2 rounded block">
            Subscription Plans
          </Link>
        </li>
        <li>
          <Link href="/admin/apikeys" className="hover:bg-gray-700 p-2 rounded block">
            API Keys
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left hover:bg-gray-700 p-2 rounded block"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
