'use client';
import { useState } from 'react';
import { IClient } from '@/types/admin';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';
import ToggleSwitch from './ToggleSwitch';
import { Edit, Trash } from 'lucide-react';

interface Props {
  clients: IClient[];
  onEdit: (client: IClient) => void;
  onDelete: (clientId: string) => Promise<void>;
  onReactivate: (payload: {
    clientId: string;
    extendMonths: number;
  }) => Promise<IClient>;
  onDeactivate: (clientId: string) => Promise<IClient>;
}
export default function ClientsTable({
  clients,
  onEdit,
  onDelete,
  onReactivate,
  onDeactivate,
}: Props) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);
  const [loadingReactivate, setLoadingReactivate] = useState<string | null>(
    null,
  );

  const handleConfirmDelete = async () => {
    if (!selectedClientId) return;
    try {
      await onDelete(selectedClientId);
      setToast({ message: 'Xóa client thành công', type: 'success' });
    } catch (err) {
      setToast({ message: 'Xóa client thất bại', type: 'error' });
    } finally {
      setSelectedClientId(null);
    }
  };

  const handleReactivate = async (clientId: string) => {
    setLoadingReactivate(clientId);
    try {
      await onReactivate({ clientId, extendMonths: 2 }); // truyền object đúng
      setToast({ message: 'Client đã được kích hoạt lại!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Kích hoạt lại thất bại', type: 'error' });
    } finally {
      setLoadingReactivate(null);
    }
  };
  const handleDeactivate = async (clientId: string) => {
    setLoadingReactivate(clientId);
    try {
      await onDeactivate(clientId); // Deactivate
      setToast({ message: 'Client đã bị khóa!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Khóa client thất bại', type: 'error' });
    } finally {
      setLoadingReactivate(null);
    }
  };
  return (
    <>
      <div className='overflow-x-auto bg-white/5 rounded-2xl shadow p-4'>
        <table className='w-full table-auto text-gray-600'>
          <thead>
            <tr className='text-left border-b border-white/20'>
              {/* <th className="px-4 py-2">Client ID</th> */}
              <th className='px-4 py-2'>Ảnh đại diện</th>
              <th className='px-4 py-2'>Tên</th>
              <th className='px-4 py-2'>Lượng người dùng</th>
              <th className='px-4 py-2'>Gói sản phẩm</th>
              <th className='px-4 py-2'>Trạng thái</th>
              <th className='px-4 py-2'>Ngày hết hạn dùng thử</th>
              <th className='px-4 py-2'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.clientId} className='hover:bg-white/10 transition'>
                {/* <td className="px-4 py-2">{c.clientId}</td> */}
                <td className='px-4 py-2'>
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-300' />
                  )}
                </td>
                <td className='px-4 py-2'>{c.name}</td>
                <td className='px-4 py-2'>{c.user_count}</td>
                <td className='px-4 py-2'>
                  {c.subscription_plan?.name || '-'}
                </td>
                <td className='px-6 py-2 w-[220px]'>
                  {c.active ? '✅ Hoạt động' : '❌ Khóa'}
                </td>
                <td className='px-4 py-2'>
                  {c.trial_end
                    ? new Date(c.trial_end).toLocaleDateString()
                    : '∞'}
                </td>
                <td className='px-4 py-2 flex gap-2'>
                  <button
                    className='p-2 bg-green-600 hover:bg-green-700 rounded-full transition'
                    onClick={() => onEdit(c)}
                  >
                    <Edit size={16} className='text-white' />
                  </button>

                  <button
                    className='p-2 bg-red-600 hover:bg-red-700 rounded-full transition'
                    onClick={() => setSelectedClientId(c.clientId)}
                  >
                    <Trash size={16} className='text-white' />
                  </button>
                  <ToggleSwitch
                    checked={c.active}
                    loading={loadingReactivate === c.clientId}
                    onChange={() =>
                      c.active
                        ? handleDeactivate(c.clientId)
                        : handleReactivate(c.clientId)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup xác nhận delete */}
      <ConfirmModal
        isOpen={!!selectedClientId}
        message='Bạn có chắc muốn xóa client này không?'
        onCancel={() => setSelectedClientId(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast thông báo */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
