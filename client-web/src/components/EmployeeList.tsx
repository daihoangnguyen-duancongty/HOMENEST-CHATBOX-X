'use client';

import { useState, useEffect } from 'react';
import { fetcher } from '@/config/fetcher';
import EmployeeForm from './EmployeeForm';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [editEmployee, setEditEmployee] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetcher('/api/client/employees');
      setEmployees(data.employees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return;
    try {
      await fetcher(`/api/client/employees/${userId}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <button
        className="self-start px-5 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold rounded-xl shadow hover:opacity-90 transition"
        onClick={() => setShowForm(true)}
      >
        Tạo nhân viên mới
      </button>

      {showForm && (
        <EmployeeForm
          employee={editEmployee}
          onSuccess={() => {
            setShowForm(false);
            setEditEmployee(null);
            fetchEmployees();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditEmployee(null);
          }}
        />
      )}

      {loading ? (
        <p className="text-center text-gray-600">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="p-3 text-left">Avatar</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.userId}>
                  <td className="p-3">
                    {emp.avatar ? (
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.username}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-400 text-white rounded-xl hover:opacity-90 transition"
                      onClick={() => {
                        setEditEmployee(emp);
                        setShowForm(true);
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-xl hover:opacity-90 transition"
                      onClick={() => handleDelete(emp.userId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
