'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import Account from "@/components/Account";

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();          // Xóa token + user
    router.push('/auth/login'); // Redirect về login
  };

  return (
    <nav className="flex flex-col h-screen w-64 bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Chatbot X Admin</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/protected/dashboard" className="hover:bg-gray-700 p-2 rounded block">
            Trang chủ
          </Link>
        </li>
        <li>
          <Link href="/protected/dashboard/clients" className="hover:bg-gray-700 p-2 rounded block">
            Khách hàng
          </Link>
        </li>
        <li>
          <Link href="/protected/dashboard/subscriptions" className="hover:bg-gray-700 p-2 rounded block">
            Gói sản phẩm
          </Link>
        </li>
        <li>
          <Link href="/protected/dashboard/apikeys" className="hover:bg-gray-700 p-2 rounded block">
            API Keys
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left hover:bg-gray-700 p-2 rounded block"
          >
            Đăng xuất
          </button>
           
        </li>
      
      </ul>
        {/* ⭐ Đẩy Account xuống đáy */}
      <div className="mt-auto pt-4">
        <Account />
      </div>
    </nav>
  );
}
