'use client';

import React, { useState, useEffect } from 'react';

interface PlanModalProps {
  plan: any | null;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (updatedPlan: any) => void;
  mode: 'edit' | 'create';
}

const PlanModal: React.FC<PlanModalProps> = ({
  plan,
  isOpen,
  onCancel,
  onSave,
  mode,
}) => {
  const [form, setForm] = useState<any>({
    name: '',
    max_users: 5,
    max_files: 5,
    price: 0,
    description: '',
  });

  useEffect(() => {
    if (plan && mode === 'edit') setForm({ ...plan });
    if (mode === 'create')
      setForm({
        name: '',
        max_users: 5,
        max_files: 5,
        price: 0,
        description: '',
      });
  }, [plan, mode]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-opacity-80 flex items-center justify-center z-50 p-4'>
      <div className='bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl p-6 overflow-y-auto max-h-[90vh]'>
        <h2 className='text-2xl font-bold mb-6'>
          {mode === 'edit' ? `Sửa gói: ${plan?.name}` : 'Tạo gói mới'}
        </h2>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Tên gói</label>
          <input
            type='text'
            className='w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Người dùng tối đa
            </label>
            <input
              type='number'
              className='w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
              value={form.max_users}
              onChange={(e) =>
                setForm({ ...form, max_users: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Số file tối đa
            </label>
            <input
              type='number'
              className='w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
              value={form.max_files}
              onChange={(e) =>
                setForm({ ...form, max_files: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Giá (VNĐ)</label>
          <input
            type='number'
            className='w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium mb-1'>Mô tả</label>
          <textarea
            className='w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className='flex justify-end gap-3 flex-wrap'>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition w-full md:w-auto'
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            className='px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-700 text-white font-semibold w-full md:w-auto hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-800 transition-transform transform hover:scale-105'
          >
            {mode === 'edit' ? 'Lưu' : 'Tạo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
