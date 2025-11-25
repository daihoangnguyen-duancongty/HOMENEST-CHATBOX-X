'use client';

import { useState, useEffect } from 'react';
import { postFormData } from '@/config/fetcher';

interface EmployeeFormProps {
  employee?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const [username, setUsername] = useState(employee?.username || '');
  const [name, setName] = useState(employee?.name || '');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(employee?.avatar || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!employee?.userId;

  // Avatar preview
  useEffect(() => {
    if (!avatarFile) return;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!username.trim() || !name.trim() || (!isEdit && !password.trim())) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username.trim());
      formData.append('name', name.trim());
      if (!isEdit) formData.append('password', password.trim());
      if (avatarFile) formData.append('avatar', avatarFile);

      if (isEdit) {
        await postFormData(`/api/client/employees/${employee.userId}`, formData, 'PUT');
      } else {
        await postFormData('/api/client/create-employee', formData, 'POST');
      }

      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-4 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-2xl w-full max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {isEdit ? 'Cập nhật nhân viên' : 'Tạo nhân viên mới'}
        </h2>

        {avatarPreview && (
          <div className="w-24 h-24 mx-auto mb-2">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          required
        />
        {!isEdit && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            required
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="p-2 border rounded border-gray-300"
        />

        {error && <p className="text-red-600 font-medium">{error}</p>}

        <div className="flex flex-wrap gap-3 justify-end mt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow hover:opacity-90 transition"
          >
            {isEdit ? 'Cập nhật' : 'Tạo'}
          </button>
        </div>
      </form>
    </div>
  );
}
