"use client";
import { useState } from "react";
import { IClient } from "@/types/admin";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import ToggleSwitch from "./ToggleSwitch";

interface Props {
  clients: IClient[];
  onEdit: (client: IClient) => void;
  onDelete: (clientId: string) => Promise<void>;
  onReactivate: (payload: { clientId: string; extendMonths: number }) => Promise<IClient>;
  onDeactivate: (clientId: string) => Promise<IClient>;
}
export default function ClientsTable({ clients, onEdit, onDelete, onReactivate, onDeactivate }: Props) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [loadingReactivate, setLoadingReactivate] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!selectedClientId) return;
    try {
      await onDelete(selectedClientId);
      setToast({ message: "Xóa client thành công", type: "success" });
    } catch (err) {
      setToast({ message: "Xóa client thất bại", type: "error" });
    } finally {
      setSelectedClientId(null);
    }
  };

const handleReactivate = async (clientId: string) => {
  setLoadingReactivate(clientId);
  try {
    await onReactivate({ clientId, extendMonths: 2 }); // truyền object đúng
    setToast({ message: "Client đã được kích hoạt lại!", type: "success" });
  } catch (err) {
    setToast({ message: "Kích hoạt lại thất bại", type: "error" });
  } finally {
    setLoadingReactivate(null);
  }
};
const handleDeactivate = async (clientId: string) => {
  setLoadingReactivate(clientId);
  try {
    await onDeactivate(clientId); // Deactivate
    setToast({ message: "Client đã bị khóa!", type: "success" });
  } catch (err) {
    setToast({ message: "Khóa client thất bại", type: "error" });
  } finally {
    setLoadingReactivate(null);
  }
};
  return (
    <>
      <div className="overflow-x-auto bg-white/5 rounded-2xl shadow p-4">
        <table className="w-full table-auto text-gray-600">
          <thead>
            <tr className="text-left border-b border-white/20">
              <th className="px-4 py-2">Client ID</th>
              <th className="px-4 py-2">Avatar</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Users</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2">Trial End</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.clientId} className="hover:bg-white/10 transition">
                <td className="px-4 py-2">{c.clientId}</td>
                <td className="px-4 py-2">{c.avatar}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.user_count}</td>
                <td className="px-4 py-2">{c.active ? '✅' : '❌'}</td>
                <td className="px-4 py-2">{c.trial_end ? new Date(c.trial_end).toLocaleDateString() : '∞'}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="px-2 py-1 bg-green-600 rounded" onClick={() => onEdit(c)}>Edit</button>
                  <button className="px-2 py-1 bg-red-600 rounded" onClick={() => setSelectedClientId(c.clientId)}>Delete</button>
                 <ToggleSwitch
  checked={c.active}
  loading={loadingReactivate === c.clientId}
  onChange={() =>
    c.active ? handleDeactivate(c.clientId) : handleReactivate(c.clientId)
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
        message="Bạn có chắc muốn xóa client này không?"
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
