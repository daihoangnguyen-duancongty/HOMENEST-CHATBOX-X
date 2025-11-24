'use client';
import { useState } from 'react';
import { useClients } from '@/hooks/useClientsOwner';
import { usePlans } from '@/hooks/usePlans';
import ClientsTable from '@/components/ClientsTable';
import ClientFormModal from '@/components/ClientFormModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import SuccessPopup from '@/components/SuccessPopup';

export default function AdminClientsPage() {
  const { query, create, update, remove, reactivate, deactivate } =
    useClients();
  const { query: plansQuery } = usePlans(); // lấy gói

  // console.log(query);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedClient(null);
    setShowModal(false);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedClient) {
        await update.mutateAsync({
          id: selectedClient.clientId,
          payload: data,
        });
        setSuccessMessage('Cập nhật khách hàng thành công!');
      } else {
        await create.mutateAsync(data);
        setSuccessMessage('Tạo khách hàng thành công!');
      }

      setSuccessOpen(true);

      setTimeout(() => {
        handleCloseModal();
      }, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      await remove.mutateAsync(clientId);
      // React Query sẽ tự invalidate ['clients'] nên table sẽ tự cập nhật
    } catch (err) {
      console.error('Xóa client thất bại', err);
    }
  };

  return (
    <div className='p-8 flex flex-col gap-6 relative'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-extrabold mb-8 text-gray-900'>
          Khách hàng
        </h1>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className='absolute top-[8vh] right-[2vw] px-3 py-3 w-[10vw] bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 transform hover:scale-105 transition duration-300'
      >
        Tạo mới
      </button>
      {query.isLoading ? (
        <LoadingOverlay open={true} message='Đang tải dữ liệu...' />
      ) : (
        <ClientsTable
          clients={query.data || []} // query.data là IClient[]
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReactivate={(payload) => reactivate.mutateAsync(payload)}
          onDeactivate={(clientId) => deactivate.mutateAsync(clientId)}
        />
      )}

      {showModal && (
        <ClientFormModal
          clients={query.data || []}
          client={selectedClient}
          plans={plansQuery.data || []}
          onClose={handleCloseModal}
          onSubmit={() => {}} // không dùng, xử lý trực tiếp trong modal
          onSuccess={(message: string) => {
            setSuccessMessage(message);
            setSuccessOpen(true);
          }}
        />
      )}
      <SuccessPopup
        open={successOpen}
        message={successMessage}
        autoClose={true}
        duration={1200}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}
