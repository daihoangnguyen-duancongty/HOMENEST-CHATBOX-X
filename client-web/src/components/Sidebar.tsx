'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import Account from '@/components/Account';
import { FaHome, FaBook, FaUsers, FaBoxOpen, FaBrain } from 'react-icons/fa';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);     // 👈 GET ROLE HERE
  const router = useRouter();

  const isClient = user?.role === 'client';
  const isEmployee = user?.role === 'employee';

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav
      className={`flex flex-col h-screen w-64 bg-pink-600 text-white p-4 ${className}`}
    >
      <h1 className='text-2xl font-bold mb-6'>
        Chatbot X {isEmployee ? 'Employee' : 'Client'}
      </h1>

      <ul className='space-y-2'>

        <li>
          <Link href='/protected/dashboard' className='hover:bg-gray-700 p-2 rounded block flex items-center gap-2'>
            <FaHome /> Trang chủ
          </Link>
        </li>

        {/*  Only CLIENT can see Documents */}
        {isClient && (
          <li>
            <Link href='/protected/dashboard/documents' className='hover:bg-gray-700 p-2 rounded block flex items-center gap-2'>
              <FaBook /> Hướng dẫn
            </Link>
          </li>
        )}

        {/*  Chat – both can see */}
        <li>
          <Link href='/protected/dashboard/chat' className='hover:bg-gray-700 p-2 rounded block flex items-center gap-2'>
            <FaBoxOpen /> Tin nhắn
          </Link>
        </li>

        {/*  Customer – both can see */}
        <li>
          <Link href='/protected/dashboard/customers' className='hover:bg-gray-700 p-2 rounded block flex items-center gap-2'>
            <FaUsers /> Khách hàng
          </Link>
        </li>

        {/*  Employees – ONLY CLIENT */}
        {isClient && (
          <li>
            <Link href='/protected/dashboard/employees' className='hover:bg-gray-700 p-2 rounded block flex items-center gap-2'>
              <FaUsers /> Nhân viên
            </Link>
          </li>
        )}

        {/*  Plans – ONLY CLIENT */}
        {isClient && (
          <li>
            <Link href='/protected/dashboard/plans' className='hover:bg-gray-700 p-2 rounded block flex items-center gap-2'>
              <FaBoxOpen /> Gói sản phẩm
            </Link>
          </li>
        )}

        {/*  Train model – ONLY CLIENT */}
        {isClient && (
          <li>
            <Link href='/protected/dashboard/train-model' className='hover:bg-gray-700 p-2 rounded block flex items-center gap-2'>
              <FaBrain /> Huấn luyện mô hình
            </Link>
          </li>
        )}

      </ul>

      <div className='mt-auto pt-4'>
        <Account />
      </div>
    </nav>
  );
}
