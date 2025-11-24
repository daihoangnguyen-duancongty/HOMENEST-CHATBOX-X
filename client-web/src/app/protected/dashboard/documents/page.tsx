'use client';

import { useState } from 'react';
import { HiOutlineCheckCircle } from 'react-icons/hi';

interface DocStep {
  title: string;
  description: string;
}

export default function DocumentsPage() {
  const [docs] = useState<DocStep[]>([
    {
      title: 'Đăng nhập',
      description:
        'Sử dụng tài khoản Admin để đăng nhập vào hệ thống và truy cập các tính năng quản trị.',
    },
    {
      title: 'Quản lý khách hàng',
      description:
        'Truy cập menu “Khách hàng” để xem, thêm, chỉnh sửa hoặc xóa thông tin người dùng.',
    },
    {
      title: 'Quản lý gói sản phẩm',
      description:
        'Truy cập menu “Gói sản phẩm” để quản lý các gói đăng ký và các ưu đãi liên quan.',
    },
    {
      title: 'Huấn luyện mô hình AI',
      description:
        'Sử dụng menu “Huấn luyện mô hình” để thêm dữ liệu huấn luyện cho AI, cải thiện hiệu suất dự đoán.',
    },
    {
      title: 'Tìm kiếm & lọc dữ liệu',
      description:
        'Sử dụng thanh tìm kiếm và bộ lọc để nhanh chóng quản lý dữ liệu và truy xuất thông tin cần thiết.',
    },
  ]);

  return (
    <div className='flex min-h-screen '>
      <main className='flex-1 ml-4 p-8 overflow-auto'>
        <h1 className='text-4xl font-extrabold mb-8 text-gray-900'>
          Hướng dẫn sử dụng hệ thống Admin
        </h1>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {docs.map((doc, idx) => (
            <div
              key={idx}
              className='bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300'
            >
              <div className='flex items-center mb-4'>
                <HiOutlineCheckCircle className='h-8 w-8 text-indigo-500 mr-3' />
                <h2 className='text-xl font-semibold text-gray-800'>
                  {doc.title}
                </h2>
              </div>
              <p className='text-gray-600'>{doc.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
