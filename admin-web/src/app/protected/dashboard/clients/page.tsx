'use client';
import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import ClientsTable from '@/components/ClientsTable';
import ClientFormModal from '@/components/ClientFormModal';


export default function AdminClientsPage() {
  
const { query, create, update, remove, reactivate, deactivate } = useClients();

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
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
      if (selectedClient) await update.mutateAsync({ id: selectedClient.clientId, payload: data });
      else await create.mutateAsync(data);
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

const handleDelete = async (clientId: string) => {
  try {
    await remove.mutateAsync(clientId);
    // React Query sẽ tự invalidate ['clients'] nên table sẽ tự cập nhật
  } catch (err) {
    console.error("Xóa client thất bại", err);
  }
};




  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Clients</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-400 rounded hover:bg-blue-500 transition">Tạo khách hàng mới</button>
      </div>

      {query.isLoading ? <p className="text-white">Loading...</p> :
        <ClientsTable
  clients={query.data || []} // query.data là IClient[]
  onEdit={handleEdit}
  onDelete={handleDelete}
  onReactivate={(payload) => reactivate.mutateAsync(payload)}
   onDeactivate={(clientId) => deactivate.mutateAsync(clientId)}
/>

      }

      {showModal && <ClientFormModal  clients={query.data || []} client={selectedClient} onSubmit={handleSubmit} onClose={handleCloseModal} />}
    </div>
  );
}
