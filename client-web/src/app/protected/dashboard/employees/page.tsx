'use client';

import EmployeeList from '@/components/EmployeeList';

export default function EmployeePage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Quản lý nhân viên</h1>
      <EmployeeList />
    </div>
  );
}
