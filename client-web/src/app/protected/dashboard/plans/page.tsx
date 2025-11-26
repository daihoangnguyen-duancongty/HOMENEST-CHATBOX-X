'use client';

import { useState } from 'react';
import { usePlans } from '@/hooks/usePlans';
import LoadingOverlay from '@/components/LoadingOverlay';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';
import PlanModal from '@/components/PlanModal';

export default function SubscriptionsPage() {
  const { query, create, update, remove } = usePlans();
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);

  const [confirmDeletePlan, setConfirmDeletePlan] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = (plan: any) => setConfirmDeletePlan(plan);

  const confirmDelete = async () => {
    if (!confirmDeletePlan) return;
    try {
      await remove.mutateAsync(confirmDeletePlan._id);
      setToast({ message: 'Xóa gói thành công', type: 'success' });
    } catch {
      setToast({ message: 'Xóa thất bại', type: 'error' });
    } finally {
      setConfirmDeletePlan(null);
    }
  };

  const handleEdit = (plan: any) => setEditingPlan(plan);
  const handleCreate = () => setCreating(true);

  const handleSaveEdit = async (updatedPlan: any) => {
    try {
      await update.mutateAsync({ id: updatedPlan._id, payload: updatedPlan });
      setToast({ message: 'Cập nhật gói thành công', type: 'success' });
    } catch {
      setToast({ message: 'Cập nhật thất bại', type: 'error' });
    } finally {
      setEditingPlan(null);
    }
  };

  const handleSaveCreate = async (newPlan: any) => {
    try {
      await create.mutateAsync(newPlan);
      setToast({ message: 'Tạo gói thành công', type: 'success' });
    } catch {
      setToast({ message: 'Tạo gói thất bại', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  if (query.isLoading) return <LoadingOverlay open />;

  return (
    <div className='p-8 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      {(creating || editingPlan) && (
        <div className='fixed inset-0 bg-gray-950/20 z-40 ' />
      )}

      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text'>Gói sản phẩm</h1>
        <button
          onClick={handleCreate}
          className='px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 transform hover:scale-105 transition duration-300'
        >
          Tạo mới
        </button>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {query.data?.map((plan) => (
          <div
            key={plan._id}
            className='bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition'
          >
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              {plan.name}
            </h2>
            <p className='text-gray-600 mb-2'>
              Người dùng tối đa: {plan.max_users}
            </p>
            <p className='text-gray-600 mb-2'>
              Số file tối đa: {plan.max_files}
            </p>
            <p className='text-gray-600 mb-2'>
              Giá: {plan.price.toLocaleString()} VNĐ
            </p>
            <p className='text-gray-500 mb-4'>{plan.description}</p>
            <div className='flex gap-2'>
              <button
                onClick={() => handleEdit(plan)}
                className='px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-700 text-white font-semibold w-full md:w-auto hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-800 transition-transform transform hover:scale-105'
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(plan)}
                className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal tạo */}
      <PlanModal
        isOpen={creating}
        plan={null}
        mode='create'
        onCancel={() => setCreating(false)}
        onSave={handleSaveCreate}
      />

      {/* Modal edit */}
      <PlanModal
        isOpen={!!editingPlan}
        plan={editingPlan}
        mode='edit'
        onCancel={() => setEditingPlan(null)}
        onSave={handleSaveEdit}
      />

      {/* Confirm Xóa */}
      <ConfirmModal
        isOpen={!!confirmDeletePlan}
        message={`Bạn có chắc chắn muốn xóa gói "${confirmDeletePlan?.name}" không?`}
        onCancel={() => setConfirmDeletePlan(null)}
        onConfirm={confirmDelete}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
